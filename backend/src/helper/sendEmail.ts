import nodemailer from 'nodemailer'

import { EmailDataType } from '../types/types'


export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
})
export const emailSender = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: SMTP_USERNAME,
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
