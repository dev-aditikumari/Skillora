const otpTemplate = (otp)=>{
    return `<!DOCTYPE html>
    <html>
    <body>
     <div style="font-family: Arial; max-width: 400px; margin: auto; text-align: center;">
  <h2 style="color: #4f46e5;">Skillora</h2>
  <p>Your verification code is:</p>
  <!-- YOUR TURN: the OTP in big bold text. Use ${otp} and a style with a font-size like 32px -->
  <!-- YOUR TURN: a small grey line saying the code expires in 5 minutes -->
    <p style="font-size: 32px; font-weight: bold; color: #4f46e5;">${otp}</p>
    <p style="color: #888; font-size: 14px;">This code expires in 5 minutes.</p>
</div>

    </body>
  </html>`;
}

module.exports = otpTemplate;