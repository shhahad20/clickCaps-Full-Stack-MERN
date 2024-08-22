import nodemailer from 'nodemailer'
import 'dotenv/config'

import { EmailDataType } from '../types/types.js'

 
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})
export const emailSender = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }
    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent: %s', info.response)
  } catch (error) {
    console.error('Error encountered while sening email', error)
    throw error
  }
}
