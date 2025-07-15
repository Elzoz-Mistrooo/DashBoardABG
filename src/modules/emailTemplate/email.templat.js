export const confirmEmailTemplate = ({ link, rfLink } = {}) => {
    return `<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style type="text/css">
      body { background-color: #88BDBF; margin: 0px; }
    </style>
  </head>
  <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color:#F3F3F3;border:1px solid #630E2B;">
      <tr>
        <td>
          <table border="0" width="100%">
            <tr>
              <td>
                <h1>
                  <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
              </td>
              <td>
                <p style="text-align:right;">
                  <a href="https://dash-board-abg.vercel.app/" target="_blank" style="text-decoration:none;">View In Website</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color:#fff;">
            <tr>
              <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="${process.env.logo}" />
              </td>
            </tr>
            <tr>
              <td><h1 style="padding-top:25px;color:#630E2B">Email Confirmation</h1></td>
            </tr>
            <tr>
              <td>
                <a href="${link}" style="margin:10px 0 30px;display:inline-block;border-radius:4px;padding:10px 20px;border:0;color:#fff;background-color:#630E2B;text-decoration:none;">Verify Email Address</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="${rfLink}" style="margin:10px 0 30px;display:inline-block;border-radius:4px;padding:10px 20px;border:0;color:#fff;background-color:#630E2B;text-decoration:none;">Request New Email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table border="0" width="100%" style="text-align:center;">
            <tr><td><h3 style="margin-top:10px;color:#000">Stay in touch</h3></td></tr>
            <tr>
              <td>
                <div style="margin-top:20px;">
                  <a href="${process.env.facebookLink}" style="text-decoration:none;">
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" height="50px"/>
                  </a>
                  <a href="${process.env.instegram}" style="text-decoration:none;">
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" height="50px"/>
                  </a>
                  <a href="${process.env.twitterLink}" style="text-decoration:none;">
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" height="50px"/>
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
  };
  