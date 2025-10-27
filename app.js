const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const examModel = require("./models/exam")
require("dotenv").config()

console.log("Email:", process.env.EMAIL_USER);
console.log("Password:", process.env.EMAIL_PASS);

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
app.post("/calculate", async (request, response) => {
    const sname = request.body.name
    const admno = request.body.admno
    const subject = request.body.subject
    const email = request.body.email
    const present = parseInt(request.body.present)
    const totaldays = parseInt(request.body.days)
    const inter1 = parseInt(request.body.intern1)
    const inter1tot = parseInt(request.body.totali1)
    const inter2 = parseInt(request.body.intern2)
    const inter2tot = parseInt(request.body.totali2)
    const assign1 = parseInt(request.body.assignment1)
    const assign2 = parseInt(request.body.assignment2)

    const attendance = (present / totaldays) * 8
    const first = (inter1 / inter1tot) * 10
    const second = (inter2 / inter2tot) * 10
    const assign = assign1 + assign2
    const total = attendance + first + second + assign

    let data_store=new examModel(
        {
        name:sname,
        admno:admno,
        subject:subject,
        email:email,
        present:present,
        totaldays:totaldays,
        inter1:inter1,
        inter1tot:inter1tot,
        inter2:inter2,
        inter2tot:inter2tot,
        assign1:assign1,
        assign2:assign2,
        internalmark:total
    }
    )

    data_store.save()



    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Internal Mark Report for ${subject}`,
            html: `
                <h2>Hello ${sname},</h2>
                <p>Here are your internal marks:</p>
                <ul>                    
                    <li><strong>Subject:</strong> ${subject}</li>
                    <li><strong>Attendance:</strong> ${attendance}</li>
                    <li><strong>First Series:</strong> ${first}</li>
                    <li><strong>Second Series:</strong> ${second}</li>
                    <li><strong>Assignment:</strong> ${assign}</li>
                    <li><strong>Total Internal Marks:</strong> <b>${total}</b></li>
                </ul>
                <p>Best wishes,<br/>Your Faculty</p>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log("Email sent to:", email);
    } catch (error) {
        console.error("Email error:", error);
        return response.status(500).json({ message: "Failed to send email", error });
    }


    response.json({ "Name": sname,"Subject":subject, "attendance": attendance, "Firstseries": first, "secondseries": second, "assignment": assign, "internalmark": total })
})


app.post("/viewall",(request,response)=>{
    examModel.find().then(
        (items)=>{
            response.json(items)
        }
    ).catch((error)=>{
        alert("something went wrong"+error)
    })
})



app.listen(4000, () => {
    console.log("Server is running")
})