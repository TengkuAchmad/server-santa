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
exports.findOne = async(req, res) => {
    try {
        const id = req.locals.user

        const responseData = await prisma.dataMedis.findMany({
            where : {
                UUID_UA: id,
            }, include: {
                MedicPersonel: {
                    select: {
                        Name_MP: true,
                    }
                },
            }
        });

        return res.status(200).json(responseData);

    } catch (error){
        return res.status(500).json({error: "An error occured" + error});
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.body.nik || !req.body.diagnosis || !req.body.obat || !req.body.alergi || !req.body.id ) {
            return res.status(400).send({
                message: "Invalid request on body"
            });
        };

        const uuidUser = await prisma.userAccount.findMany({
            where:{
                NIK_UA: req.body.nik
            }, select : {
                UUID_UA: true
            }, take: 1
        })
        
        let uuid            = uuidv4();

        await prisma.dataMedis.create({
            data : {
                UUID_DM: uuid,
                UUID_UA: uuidUser[0].UUID_UA,
                UUID_MP: req.body.id,
                Diagnosis_DM: req.body.diagnosis,
                Obat_DM: req.body.obat,
                Alergi_DM: req.body.alergi
            }
        });

        await prisma.ticketing.updateMany({
            where: {
                UUID_UA: uuidUser[0].UUID_UA,
                isWaiting_TC: true
            }, data :  {
                isWaiting_TC: false,
                isCancelled_TC: false,
                isDone_TC: true
            }
        })

        return res.status(201).send({
            message: "Data medis user created successfully"
        });

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }

}

exports.findAll = async (req, res) => {
    try {
        const responseDatas = await prisma.dataMedis.findMany({
            include: {
                MedicPersonel: {
                    select: {
                        Name_MP: true,
                    }
                },
            }
        });

        return res.status(200).json(responseDatas);

    } catch (error) {
        return res.status(500).json({error: "An error occured", error});
    }
}


exports.deleteAll = async(req, res) => {
    try {
        await prisma.dataMedis.deleteMany({});

        return res.status(200).json({message : "All data medis successfully deleted"});
    
    } catch (error) {
        return res.status(500).json({error : "An error occured" + error});
    }
}