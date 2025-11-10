const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "random bytes key"

module.exports = {
    createUser: async (req, res) => {
        try {
            const { username, password } = req.body
            const prisma = req.prisma

            if (!username || !password) {
                return res.status(400).json({status: 0, message: "Username and password are required"})
            }

            const existingUser = await prisma.users.findUnique({where: {username} })

            if (existingUser) {
                return res.status(409).json({status: 0, message: "User already exists"})
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await prisma.users.create({
                data: {
                    username,
                    password: hashedPassword
                }
            })

            res.status(201).json({status: 1, message: "User created successfully", userID: newUser.userID})

        } catch (err) {
            console.error(err)
            res.status(500).json({status: 0, message: "Error creating user"})
        }
    },

    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body
            const prisma = req.prisma

            const user = await prisma.users.findUnique({ where: { username } })

            if (!user) {
                return res.status(404).json({ status: 0, message: "User not found"})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return res.status(401).json({status: 0, message: "Invalid password"})
            }

            const token = jwt.sign(
                {userID: user.userID, username: user.username},
                JWT_SECRET,
                {expiresIn: "2h"}    
            )

            await prisma.users.update({
                where: {userID: user.userID},
                data: {sessionStatus: true}
            })

            res.json({
                status: 1, 
                message: "Login success", 
                token,
                userID: user.userID,
                username: user.username
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({status: 0, message: "Login error"})
        }
    },

    logoutUser: async (req, res) => {
        try {
            const { userID } = req.body
            const prisma = req.prisma

            await prisma.users.update({
                where: {userID: Number(userID)},
                data: {sessionStatus: false}
            })

            res.json({status: 1, message: "Logout success"})

        } catch (err) {
            console.error(err)
            res.status(500).json({status: 0, message: "Logout error"})
        }
    },

    getUsers: async (req, res) => {
        try {
            const prisma = req.prisma
            const users = await prisma.users.findMany()
            res.json(users)
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 0, message: "Database error"})
        }
    }
}