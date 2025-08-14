// const bcrypt = require('bcryptjs');
// const UserModel = require("../Model/LoginModel");

// const UserLogin = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Find the user by email
//         const user = await UserModel.findOne({ email: email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Compare the entered password with the hashed password in the database
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(401).json({ message: "Incorrect password" });
//         }

//         // If login is successful
//         res.status(200).json({ message: "Login successful", user });
//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// module.exports = { UserLogin };


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../Model/LoginModel");

const UserLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // payload
            process.env.JWT_SECRET,              // secret key
            { expiresIn: "1d" }                  // token expiry
        );

        // 4. Send back token and basic user info
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { UserLogin };
