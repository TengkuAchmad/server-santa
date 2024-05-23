// LIBRARY IMPORT
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

// CONSTANT IMPORT
const { JWT_SECRET } = process.env;

// ORM
const prisma = new PrismaClient();

// FUNCTION IMPORT
exports.auth = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Invalid request on body",
      });
    }

    const user = await prisma.userAccount.findUnique({
      where: {
        Email_UA: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (await argon2.verify(user.Password_UA, req.body.password)) {
      const accessToken = jwt.sign({ userID: user.UUID_UA }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({ success: true, accessToken });
    } else {
      return res.status(401).send({
        message: "Invalid password",
      });
    }
  } catch (e) {
    return res.status(500).send({ message: "An error occured" + e });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.locals.user;

    const responseData = await prisma.userAccount.findUnique({
      where: {
        UUID_UA: id,
        isPasien_UA: false,
        isOfficer_UA: true,
      },
      select: {
        UUID_UA: true,
        Name_UA: true,
        Email_UA: true,
        Phone_UA: true,
        Photo_UA: true,
        NIP_UA: true,
        BirthDate_UA: true,
      },
    });

    return res.status(200).json(responseData);
  } catch (e) {
    return res.status(500).json({ error: "An error occured" + e });
  }
};

exports.signup = async (req, res) => {
  try {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.name ||
      !req.body.birthdate ||
      !req.body.nip
    ) {
      return res.status(400).send({
        message: "Invalid request on body",
      });
    }

    const hashPassword = await argon2.hash(req.body.password);

    let uuid = uuidv4();

    await prisma.userAccount.create({
      data: {
        UUID_UA: uuid,
        Email_UA: req.body.email,
        Password_UA: hashPassword,
        Name_UA: req.body.name,
        Phone_UA: req.body.phone,
        BirthDate_UA: req.body.birthdate,
        NIP_UA: req.body.nip,
        isOfficer_UA: true,
        isPasien_UA: false,
        Photo_UA: "default",
      },
    });

    return res.status(201).send({
      message: "User created successfully",
    });
  } catch (e) {
    return res.status(500).json({ error: "An error occured", e });
  }
};

exports.findAll = async (req, res) => {
  try {
    const responseDatas = await prisma.userAccount.findMany({
      where: {
        isOfficer_UA: true,
      },
      select: {
        UUID_UA: true,
        Email_UA: true,
        Name_UA: true,
        Phone_UA: true,
        Photo_UA: true,
        NIP_UA: true,
        BirthDate_UA: true,
      },
    });

    return res.status(200).json(responseDatas);
  } catch (e) {
    return res.status(500).json({ error: "An error occured", e });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { uuid } = req.params;

    await prisma.userAccount.delete({
      where: {
        isOfficer_UA: true,
        UUID_UA: uuid,
      },
    });

    return res.json({ message: "User deleted successfully" });
  } catch (e) {
    return res.status(500).json({ error: "An error occured" + e });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await prisma.userAccount.deleteMany({
      where: {
        isOfficer_UA: true,
      },
    });

    return res
      .status(200)
      .json({ message: "All user account successfully deleted" });
  } catch (e) {
    return res.status(500).json({ error: "An error occured" + e });
  }
};
