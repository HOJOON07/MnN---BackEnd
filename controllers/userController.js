require('./mongoConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const axios = require('axios');
const { clearConfigCache } = require('prettier');

// 토큰 인증 미들웨어

//회원가입 컨트롤러
const signUpUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ user_id: req.body.user_id });
    const { user_id, user_password, user_name, user_email, tel } = req.body;
    if (!findUser) {
      const hashedPassword = await bcrypt.hash(user_password, 10);
      await User.create({
        user_id,
        user_password: hashedPassword,
        user_name,
        user_email,
        tel,
      });
      res.status(200).json('회원 가입 성공');
    } else {
      res.status(400).json('이미 존재 하는 회원입니다.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('알 수 없는 오류, 입력한 정보를 다시 확인 해보세요.');
  }
};
//회원 가입 후 (이미지,자기소개,스킬 )
const addUserInfo = async (req, res) => {
  try {
    // const { bio, img, skills } = req.body;
    // const updateUserInfo = await User.findOne({ user_id: req.body.user_id });
    // await updateUserInfo.update({ bio }, { $set: { bio: req } });
    await User.updateOne(
      {
        user_id: { $eq: req.body.user_id },
      },
      {
        $set: {
          bio: req.body.bio,
          img: req.body.img,
          skills: req.body.skills,
        },
      },
    );
    res.status(200).json('유저 정보 추가 성공');
  } catch (err) {
    res.status(500).json('입력된 정보를 다시 확인해주세요.');
    console.log(err);
  }
};
//로그인 컨트롤러

const loginUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ user_id: req.body.user_id });
    const match = await bcrypt.compare(
      req.body.user_password,
      findUser.user_password,
    );
    if (!findUser) return res.status(400).json('아이디를 잘못 입력했습니다.'); //회원 정보에서 유저 아이디가 없는 경우
    if (!match) return res.status(400).json('비밀번호를 잘못 입력했습니다.'); // body의 비밀번호와 회원정보 비밀번호가 일치하지 않는 경우
    if (findUser && match) {
      // const token = jwt.sign(
      //   { user_id: findUser.user_id },
      //   process.env.JWT_SECRET_KEY,
      //   {
      //     issuer: 'server', //발행자
      //     expiresIn: '24h', // 유효기간
      //   },
      // );
      const accessToken = jwt.sign(
        {
          user_id: findUser.user_id,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        {
          expiresIn: '30m',
          issuer: 'server',
        },
      );
      const refreshToken = jwt.sign(
        {
          user_id: findUser.user_id,
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: '24h',
          issuer: 'server',
        },
      );
      //토큰 전송
      res.cookie('accessToken', accessToken, {
        secure: false,
        httpOnly: true,
      });
      res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
      });
      res.status(200).json('login success'); //유저아이디가 있고 비밀번호가 일치할 때
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const accessToken = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

    const findUser = await User.findOne({ user_id: req.body.user_id });
    const { user_password, ...others } = findUser;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    // const token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2h3bnMxMDA3IiwiaWF0IjoxNjgxMTkyNTc5LCJleHAiOjE2ODEyNzg5NzksImlzcyI6InNlcnZlciJ9.O1r-Nh3KAc1Jhz8gBp1zxoSgT64imMdNV4yU7-TyZhE';

    const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);

    const findUser = await User.findOne({ user_id: req.body.user_id });
    const { user_password, ...others } = findUser;
    res.status(200).json(others);
    //액세스 토큰 새로 발급
    const accessToken = jwt.sign(
      {
        user_id: findUser.user_id,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: '30m',
        issuer: 'server',
      },
    );
    res.cookie('accessToken', accessToken, {
      secure: false,
      httpOnly: true,
    });
    res.status(200).json('Access Token Recreated');
  } catch (err) {
    res.status(500).json(err);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('accessToken', '');
    res.status(200).json('로그아웃 성공');
  } catch (err) {
    res.status(500).json(err);
  }
};

const kakaoLogin = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(req.body);

    const kakaoFindUser = await User.findOne({
      user_id,
    });

    console.log(kakaoFindUser);
    if (!kakaoFindUser) {
      await User.create({
        user_id: user_id,
        user_password: 'adsad1s2321sa',
        user_name: 'asdassdas',
        user_email: '아무거나 assasassa.!!!!',
        tel: '010-1234-1234',
      });
      const accessToken = jwt.sign(
        {
          user_id,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        {
          expiresIn: '30m',
          issuer: 'server',
        },
      );
      const refreshToken = jwt.sign(
        {
          user_id,
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: '24h',
          issuer: 'server',
        },
      );
      //토큰 전송
      res.cookie('accessToken', accessToken, {
        secure: false,
        httpOnly: true,
      });
      res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
      });
      return res.status(200).json('login success');
    }
    return res.status(200).json('login success');

    // const findUser = await User.findOne({ user_id: req.body.user_id });
    // const match = await bcrypt.compare(
    //   req.body.user_password,
    //   findUser.user_password,
    // );
    // if (!findUser) return res.status(400).json('아이디를 잘못 입력했습니다.'); //회원 정보에서 유저 아이디가 없는 경우
    // if (!match) return res.status(400).json('비밀번호를 잘못 입력했습니다.'); // body의 비밀번호와 회원정보 비밀번호가 일치하지 않는 경우
    // if (findUser && match) {
  } catch (err) {
    console.log(err);
    return res.status(500).json('login failed');
  }
};

const GITHUB_CLIENT_ID = '052e16cc26d82c4a72dc';
const GITHUB_REDIRECT_URI = 'http://localhost:3000/oauth/github/callback';
const GITHUB_CLIENT_SECRET = 'd10aa5ff1e2b894344bcb6c04a7d07e57a94214d';

const githubLogin = async (req, res) => {
  try {
    const ACCESS_TOKEN_URL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${req.body.token}`;

    const resCode = await axios.post(ACCESS_TOKEN_URL, {
      Accept: 'application/json',
    });

    // 토큰 발행 성공시에도 status 가 200으로 찍히며, 결과 값을 하나의 긴 쿼리 스트링으로 들어오기 때문에
    // 문장 내부에 access_token 이라는 단어가 있으면 토큰 발행 성공으로 간주
    // 실패할 경우 err_status 같은 문장이 찍힘
    if (resCode.data.indexOf('access_token') === -1)
      return res.status(400).json('토큰 발행 실패');

    // console.log('깃헙 엑세스 토큰 전체 String', resCode.data);

    // 문장 내부에서 access_token 만 분리해 내야하므로 전체 문장에서 특정 단어를 찾아서 해당 단어의 index 를 기준으로 문장을 자름
    const tokenStr = resCode.data;
    // access_token= 로 토큰이 시작 되므로 처음 시작되는 n= 의 위치를 찾아서 + 2를 더하면 토큰의 시작 index 찾기 가능
    // = 로 해도 되지만 만에 하나 토큰에 = 이 포함 될 경우를 고려하여 n= 를 찾음
    const startIndex = tokenStr.indexOf('n=') + 2;
    // 토큰이 끝나면 토큰의 만료일이 &expires 로 표현이 되므로 &exp 단어를 찾아서 해당 위치를 access_token 의 마지막 지정으로 설정
    const endIndex = tokenStr.indexOf('&scope');

    // 문장을 잘라서 access_token 만 추출출
    const accessToken = tokenStr.substring(startIndex, endIndex);
    // console.log('깃헙 엑세스 토큰', accessToken);

    // 분리한 엑세스 토큰을 엑세스 토큰을 풀어주는 깃헙 api 에 요청
    const resToken = await axios.get('https://api.github.com/user', {
      headers: {
        authorization: `token ${accessToken}`,
      },
    });
    console.log(resCode.data);

    // api 에서 제공하는 사용자 정보를 획득 + 프론트로 전송
    return res.status(200).json(resToken.data);
  } catch (err) {
    console.log(err);
  }
};
const gitLogin = async (req, res) => {
  try {
    const { user_id, bio, user_email, user_name } = req.body;
    console.log(req.body);

    const gitFindUser = await User.findOne({
      user_id,
    });
    if (!gitFindUser) {
      await User.create({
        user_id: user_id,
        user_password: 'adssad12d321sa',
        user_name,
        user_email,
        tel: '010-1234-1232',
        bio: bio,
      });
      return res.status(200).json('깃허브 로그인 성공');
    }
    return res.status(200).json('회원가입 필요 없음 로그인 성공');
  } catch (err) {
    console.log(err);
    return res.status(500).json('이상한 오류');
  }
};

module.exports = {
  signUpUser,
  addUserInfo,
  loginUser,
  accessToken,
  refreshToken,
  logout,
  kakaoLogin,
  githubLogin,
  gitLogin,
};
// kakao_account_email
