require('./mongoConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

module.exports = {
  signUpUser,
  addUserInfo,
  loginUser,
  accessToken,
  refreshToken,
  logout,
};
