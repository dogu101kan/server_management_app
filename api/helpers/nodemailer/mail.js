const asyncErrorWrapper = require("express-async-handler");
const nodemailerPrep = require("./index");

const sendMail = asyncErrorWrapper(async(info) => {
    info = JSON.parse(info);

    
    const emailTemplate = `
    SSL Certificate is Valid for ${info.website} Website Until ${info.sslResults[0].validTo}
    `;

    const body = `
    <table>
        <tr>
            <td>Valid From</td>
            <td>${info.sslResults[0].validFrom}</td>
        </tr>
        <tr>
            <td>Valid To</td>
            <td>${info.sslResults[0].validTo}</td>
        </tr>
        <tr>
            <td>Fingerprint</td>
            <td>${info.sslResults[0].fingerPrint}</td>
        </tr>
        <tr>
            <td>Serial Number</td>
            <td>${info.sslResults[0].serialNumber}</td>
        </tr>
        <tr>
            <td>Info Access</td>
            <td>${0}</td>
        </tr>
        <tr>
            <td>Created At</td>
            <td>${info.sslResults[0].createdAt}</td>
        </tr>
    </table>

    `

    try{
        await nodemailerPrep({
            from : process.env.SMTP_USER,
            to : info.mail,
            subject : emailTemplate,
            html : body
        });

        return true
        
    }
    catch(err){
        console.log(err);
        return false;
    }
});

module.exports = sendMail;