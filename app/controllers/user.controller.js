// LIBRARY IMPORT
const { PrismaClient }  = require('@prisma/client');
const { v4: uuidv4 }    = require('uuid');
const jwt               = require('jsonwebtoken');
const argon2            = require('argon2');

// CONSTANT IMPORT
const { JWT_SECRET }    = process.env;

// ORM
const prisma            = new PrismaClient();


// FUNCTION IMPORT
exports.auth = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                message: "Invalid request on body"
            });
        }

        const user = await prisma.userAccount.findUnique({
            where: {
                Email_UA: req.body.email
            }
        });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (await argon2.verify(user.Password_UA, req.body.password)) {
            const accessToken = jwt.sign({ userID: user.UUID_UA }, JWT_SECRET, { expiresIn: '1d'});

            return res.status(200).json({ success:true, accessToken })
        } else {
            return res.status(401).send({
                message: "Invalid password"
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "An error occured" + error });
    }
}

exports.findOne = async(req, res) => {
    try {
        const id = req.locals.user

        const responseData = await prisma.userAccount.findUnique({
            where : {
                UUID_UA: id,
                isPasien_UA: true,
            },
            select : {
                UUID_UA: true,
                Name_UA: true,
                Email_UA: true,
                Phone_UA: true,
                Photo_UA: true,
                NIK_UA: true,
                BirthDate_UA: true,
                DataMedis: true
            }
        });

        return res.status(200).json(responseData);

    } catch (error){
        return res.status(500).json({error: "An error occured" + error});
    }
}

exports.signup = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.phone || !req.body.name || !req.body.birthdate || !req.body.nik) {
            return res.status(400).send({
                message: "Invalid request on body"
            });
        };

        const hashPassword = await argon2.hash(req.body.password);
        
        let uuid            = uuidv4();

        await prisma.userAccount.create({
            data : {
                UUID_UA: uuid,
                Email_UA: req.body.email,
                Password_UA: hashPassword,
                Name_UA: req.body.name,
                Phone_UA: req.body.phone,
                BirthDate_UA: req.body.birthdate,
                NIK_UA: req.body.nik,
                Photo_UA: "default"
            }
        });

        await prisma.dataMedis.create({
            data: {
                UUID_DM: uuidv4(),
                UUID_UA: uuid,
            }
        })

        return res.status(201).send({
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }

}

exports.findAll = async (req, res) => {
    try {
        const responseDatas = await prisma.userAccount.findMany({
            where: {
                isPasien_UA: true,
            },
            select: {
                UUID_UA: true,
                Email_UA: true,
                Name_UA: true,
                Phone_UA: true,
                Photo_UA: true,
                NIK_UA: true,
                BirthDate_UA: true,
                DataMedis: true
            }
        });

        return res.status(200).json(responseDatas);

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }
}

exports.deleteOne = async (req, res) => {
    try {
        const {uuid} = req.params;

        const dataMedisEntry = await prisma.dataMedis.findFirst({
            where: {
              UUID_UA: uuid,
            },
          });
      
          if (!dataMedisEntry) {
            return res.status(404).send('Data Medis entry not found');
          }
      
          await prisma.dataMedis.delete({
            where: {
              UUID_DM: dataMedisEntry.UUID_DM,
            },
          });

        await prisma.userAccount.delete({
            where: {
                UUID_UA: uuid
            }
        })

        return res.json({ message: "User deleted successfully" });
    } catch (error){
        return res.status(500).json({ error: "An error occured" + error });
    }
}

exports.deleteAll = async(req, res) => {
    try {
        await prisma.dataMedis.deleteMany({});

        await prisma.userAccount.deleteMany({});

        return res.status(200).json({message : "All user account successfully deleted"});
    
    } catch (error) {
        return res.status(500).json({error : "An error occured" + error});
    }
}