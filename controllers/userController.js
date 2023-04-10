require('./mongoConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
      const token = jwt.sign({ user_id: findUser.user_id }, 'secret_key', {
        expiresIn: '24h',
      });
      res.status(200).send({ token }); //유저아이디가 있고 비밀번호가 일치할 때
    }
  } catch (err) {
    res.status(400);
    console.log(err);
  }
};
module.exports = { signUpUser, addUserInfo, loginUser };
