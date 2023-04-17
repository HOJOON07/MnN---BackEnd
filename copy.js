require('./mongoConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const axios = require('axios');
const crypto = require('crypto');

// 토큰 인증 미들웨어

//중복된 아이디 컨트롤러
const checkID = async (req, res) => {
  const findUser = await User.findOne({ user_id: req.body.user_id });
  if (findUser) {
    return res.status(400).json('이미 가입된 회원입니다.');
  } else {
    return res.status(200).json('사용 가능한 아이디 입니다.');
  }
  // res.status(500).json('올바른 형식이 아닙니다.');
};

//중복된 이메일 컨트롤러
const checkEmail = async (req, res) => {
  const findEmail = await User.findOne({ user_email: req.body.user_email });
  if (findEmail) {
    return res.status(400).json('이미 가입된 이메일 주소 입니다.');
  } else {
    return res.status(200).json('사용 가능한 이메일 입니다.');
  }
  // res.status(500).json('올바른 형식이 아닙니다.');
};

//검색결과 유저 리스트
const searchUser = async (req, res) => {
  const userList = await User.find({});
  const searchResult = userList.filter(
    (list) => list.user_id.search(req.body.result) !== -1,
  );
  res.status(200).json(searchResult);
};

//백엔드에서 처리해주는 코드
const searchUsers = async (req, res) => {
  try {
    const userList = await User.find({
      user_id: { $regex: req.query.result, $options: 'i' },
    });
    if (userList.length === 0) {
      return res.status(404).json({ error: '검색 결과가 없습니다.' });
    }
    return res.status(200).json(userList);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

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
          // user_id: 'ghwns1007',
          user_name: findUser.user_name,
          // user_name: '김호준',
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        {
          expiresIn: '1h',
          issuer: 'server',
        },
      );

      const refreshToken = jwt.sign(
        {
          // user_id: findUser.user_id,
          user_id: 'ghwns1007',
          // user_name: findUser.user_name,
          user_name: '김호준',
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: '14d',
          issuer: 'server',
        },
      );
      //토큰 전송

      res.cookie('accessToken', accessToken, {
        credentials: true,
      });
      res.cookie('refreshToken', refreshToken, {
        credentials: true,
      });

      const data = {
        accessToken,
        refreshToken,
      };
      console.log('header', req.headers.cookie);
      // res.status(200).json('login sucess'); //유저아이디가 있고 비밀번호가 일치할 때
      res.status(200).json({
        status: '200',
        accessToken,
        refreshToken,
      });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
//인증을 위한것
const accessTokenMiddleware = async (req, res, next) => {
  const ACCESTOKEN = req.header('accessToken');
  const REFRESHTOKEN = req.header('refreshToken');
  console.log('액세스', ACCESTOKEN);
  console.log('리프레쉬', REFRESHTOKEN);
  try {
    const cookies = req.headers.cookie.split('; ');

    const acsToken = cookies
      .find((cookie) => cookie.startsWith('accessToken='))
      .split('=')[1];

    console.log('토큰 검증 미들웨어, 엑세스토큰', acsToken);
    if (acsToken !== '') {
      const data = jwt.verify(acsToken, process.env.JWT_ACCESS_SECRET_KEY);
      console.log('토큰 검증 미들웨어, 디코드 데이터', data);
      // const findUser = await User.findOne({ user_id: data.user_id });
      // const { user_password, ...others } = findUser;
      return next();
    } else {
      const refToken = cookies
        .find((cookie) => cookie.startsWith('refreshToken='))
        .split('=')[1];
      if (refToken !== '') {
        const refreshdata = jwt.verify(
          refToken,
          process.env.JWT_REFRESH_SECRET_KEY,
        );
        const findUser = await User.findOne({ user_id: refreshdata.user_id });
        const { user_password, ...others } = findUser;
        // res.status(200).json(others);
        //액세스 토큰 새로 발급
        const accessToken = jwt.sign(
          {
            user_id: findUser.user_id,
          },
          process.env.JWT_ACCESS_SECRET_KEY,
          {
            expiresIn: 1000 * 10,
            issuer: 'server',
          },
        );
        req.accessToken = accessToken;
        res.cookie('accessToken', accessToken, {
          credentials: true,
        });
        return next();
      } else {
        return res.status(501).json('로그인이 필요 합니다');
      }
    }
  } catch (err) {
    if (req.headers.cookie !== undefined) {
      const cookies = req.headers.cookie.split('; ');
      console.log(err);
      const refToken = cookies
        .find((cookie) => cookie.startsWith('refreshToken='))
        .split('=')[1];
      if (refToken !== '') {
        const refreshdata = jwt.verify(
          refToken,
          process.env.JWT_REFRESH_SECRET_KEY,
        );
        const findUser = await User.findOne({ user_id: refreshdata.user_id });
        const { user_password, ...others } = findUser;

        const accessToken = jwt.sign(
          {
            user_id: findUser.user_id,
          },
          process.env.JWT_ACCESS_SECRET_KEY,
          {
            expiresIn: 1000 * 10,
            issuer: 'server',
          },
        );
        req.accessToken = accessToken;
        res.cookie('accessToken', accessToken, {
          credentials: true,
        });
        next();
      } else {
        console.log('11111');
        return res.status(501).json('로그인이 필요 합니다');
      }
    } else {
      console.log('22222');
      return res.status(500).json('로그인 해주세요');
    }
    next();
  }
};
//유효기간 연장
const refreshToken = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie.split('; ');

    const refToken = cookies
      .find((cookie) => cookie.startsWith('refreshToken='))
      .split('=')[1];
    // const token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2h3bnMxMDA3IiwiaWF0IjoxNjgxMTkyNTc5LCJleHAiOjE2ODEyNzg5NzksImlzcyI6InNlcnZlciJ9.O1r-Nh3KAc1Jhz8gBp1zxoSgT64imMdNV4yU7-TyZhE';

    const data = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET_KEY);

    const findUser = await User.findOne({ user_id: data.user_id });
    const { user_password, ...others } = findUser;
    // res.status(200).json(others);
    //액세스 토큰 새로 발급
    const accessToken = jwt.sign(
      {
        user_id: findUser.user_id,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: 1000 * 10,
        issuer: 'server',
      },
    );
    res.cookie('accessToken', accessToken, {
      credentials: true,
    });
    req.user = findUser;
    // res.json(200).json(findUser);
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
};

const loginSuccess = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie.split('; ');
    const acsToken = cookies
      .find((cookie) => cookie.startsWith('accessToken='))
      .split('=')[1];

    const data = jwt.verify(acsToken, process.env.JWT_ACCESS_SECRET_KEY);
    const findUser = await User.findOne({ user_id: data.user_id });

    next();
    // res.status(200).json(findUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err, '');
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

//랜덤 문자열 생성
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};
const kakaoLogin = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(req.body);

    const kakaoFindUser = await User.findOne({
      user_id,
    });

    if (!kakaoFindUser) {
      const user_password = generateRandomString(10);
      const user_name = generateRandomString(5);
      const user_email = `${generateRandomString(8)}@example.com`;
      await User.create({
        user_id: user_id,
        user_password: user_password,
        user_name: user_name,
        user_email: user_email,
        tel: '010-1234-1234',
      });
      const accessToken = jwt.sign(
        {
          user_id,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        {
          expiresIn: '10m',
          issuer: 'server',
        },
      );
      const refreshToken = jwt.sign(
        {
          user_id,
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: '14d',
          issuer: 'server',
        },
      );
      //토큰 전송
      res.cookie('accessToken', accessToken, {
        credentials: true,
      });
      res.cookie('refreshToken', refreshToken, {
        credentials: true,
      });

      return res.status(200).json('login success');
    }
    const accessToken = jwt.sign(
      {
        user_id,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: '10m',
        issuer: 'server',
      },
    );
    const refreshToken = jwt.sign(
      {
        user_id,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: '14d',
        issuer: 'server',
      },
    );
    res.cookie('accessToken', accessToken, {
      credentials: true,
      sameSite: 'None',
    });
    res.cookie('refreshToken', refreshToken, {
      credentials: true,
      sameSite: 'None',
    });
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
      const user_password = generateRandomString(10);
      await User.create({
        user_id: user_id,
        user_password: user_password,
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

const test = async (req, res, next) => {
  if (req.accessToken !== undefined) {
    return res.status(200).json('액세스 만료됨, 그래서 재발급');
  }
  return res.status(201).json('액세스 만료 안됨, 오케이');
};

module.exports = {
  signUpUser,
  addUserInfo,
  loginUser,
  accessTokenMiddleware,
  refreshToken,
  loginSuccess,
  logout,
  kakaoLogin,
  githubLogin,
  gitLogin,
  test,
  checkID,
  checkEmail,
  searchUser,
};
// kakao_account_email
// const accessToken = async (req, res, next) => {
//   try {
//     const cookies = req.headers.cookie.split('; ');
//     const acsToken = cookies
//       .find((cookie) => cookie.startsWith('accessToken='))
//       .split('=')[1];

//     const data = jwt.verify(acsToken, process.env.JWT_ACCESS_SECRET_KEY);

//     const findUser = await User.findOne({ user_id: data.user_id });
//     const { user_password, ...others } = findUser;
//     next();
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') { // 액세스 토큰이 만료된 경우
//       try {
//         const cookies = req.headers.cookie.split('; ');

//         const refToken = cookies
//           .find((cookie) => cookie.startsWith('refreshToken='))
//           .split('=')[1];

//         const data = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET_KEY);

//         const findUser = await User.findOne({ user_id: data.user_id });
//         const { user_password, ...others } = findUser;

//         // 리프레시 토큰을 검증하고 새로운 액세스 토큰 발급
//         const newAccessToken = jwt.sign(
//           {
//             user_id: findUser.user_id,
//           },
//           process.env.JWT_ACCESS_SECRET_KEY,
//           {
//             expiresIn: '1m',
//             issuer: 'server',
//           },
//         );
//         res.cookie('accessToken', newAccessToken, {
//           secure: false,
//           httpOnly: true,
//         });
//         next();
//       } catch (err) {
//         res.status(401).json({
//           message: 'Refresh token is invalid or expired.',
//         });
//       }
//     } else {
//       res.status(401).json(err);
//     }
//   }
// };
