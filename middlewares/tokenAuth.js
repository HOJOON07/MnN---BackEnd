const accessToken = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie.split('; ');
    const acsToken = cookies
      .find((cookie) => cookie.startsWith('accessToken='))
      .split('=')[1];

    const data = jwt.verify(acsToken, process.env.JWT_ACCESS_SECRET_KEY);

    const findUser = await User.findOne({ user_id: data.user_id });
    const { user_password, ...others } = findUser;
    next();
    // res.status(200).json(findUser);
  } catch (err) {
    // res.status(500).json(err);
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
        expiresIn: '24h',
        issuer: 'server',
      },
    );
    res.cookie('accessToken', accessToken, {
      secure: false,
      httpOnly: true,
    });
    req.user = findUser;
    // res.json(200).json(findUser);
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
