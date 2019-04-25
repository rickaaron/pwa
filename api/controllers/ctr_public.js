const validate = require('../helpers/validate.js');
const mdl_public = require('../models/mdl_public')
// const Token = require('../heplers/token.js');


// const jwt = require('jsonwebtoken'); 

// const bcrypt = require('bcrypt');
// // var nodemailer = require('nodemailer');
// var fs = require('fs');
// var formidable = require('formidable');
// var path = require('path');
// var uuid = require('uuid');
// const sharp = require('sharp');

// sharp.cache(false);
// //Uploads
// // const pathImages = path.join(__dirname, '../../uploads/img/lyf');
// const Thumbspath = path.join(__dirname, '../../uploads/img/thumbs');
// const Temporalpath = path.join(__dirname, '../../uploads/temp');
// const Userpath = path.join(__dirname, '../../uploads/users');

exports.GET_NAMES = (req, res) => {
  mdl_public.get_users().then(users => {
    res.status(200).json(users);
  });

}

exports.CheckToken = (req, res) => {
  console.log('Checking token ...');
  // console.log(req.body);
  const constraints = {
    token: {
      presence: {
        message: "Falta el Token"
      },
      length: {
        minimum: 10,
        maximum: 300,
        tooShort: "Token: Error",
        tooLong: 'Token: Error'
      }
    },
  };
  validate.async(req.body, constraints).then((success) => {

    // console.log('Token Valido:', success)
    Mdl_Login.GetToken(req.body.token).then(async (info) => {
      Mdl_Login.ActivateUser(info['f_id_user']).then((success) => {
        Mdl_Login.GetUserById(info['f_id_user']).then((user) => {
          Token.DoToken(user).then((newToken) => {
            res.json({
              status: true,
              message: 'Todo salio bien',
              token: newToken,
            })
          }, (error) => {
            res.json({
              status: false,
              type: 'error_login',
              message: error,
            })
          })
        }, (error) => {
          res.json({
            status: false,
            type: 'error_login',
            message: error,
          })
        })

        Mdl_Login.DeleteToken(req.body.token);
      }, (error) => {
        res.json({
          status: false,
          type: 'error_activate',
          message: error,
        })
      })

    }, (errors) => {
      res.json({
        status: false,
        type: 'error_token',
        message: errors,
      })
    })

  }, (errors) => {
    // console.error(errors);
    res.json({
      status: false,
      type: 'error_data',
      message: errors,
    })
  });
}
// --------------------------Image Profile
exports.SaveImage = (idUser, image) => {
  return new Promise(async (resolve, reject) => {
    //Create foldres
    if (!fs.existsSync(Temporalpath)) {
      fs.mkdirSync(Temporalpath);
    }
    if (!fs.existsSync(Userpath)) {
      fs.mkdirSync(Userpath);
    }
    let pathUser = Userpath + `/user-${idUser}`
    if (!fs.existsSync(pathUser)) {
      fs.mkdirSync(pathUser);
    }
    await Mdl_User.GetUserById(idUser).then((user) => {


      let nameImage = 'user-' + idUser + '-' + uuid.v1() + '.png';
      console.log(image);
      sharp(image).resize(1000, 1000).max().toFile(pathUser + `/${nameImage}`).then((newImage) => {
        // console.log('Image 1000 X 1000:', newImage)
        sharp(image).resize(200, 200).max().toFile(Thumbspath + `/${nameImage}`).then((thumb) => {

          Mdl_User.ChangeImagenProfile(idUser, nameImage).then((success) => {
            resolve(true)
          }, (error) => {
            fs.unlinkSync(pathUser + `/${nameImage}`);
            fs.unlinkSync(Thumbspath + `/${nameImage}`);
            reject(error)
          });

          fs.unlinkSync(image);

        }, (errorResize) => {
          reject(errorResize)
        });

      }, (errorResize) => {
        fs.unlinkSync(pathUser + `/${nameImage} `);
        reject(errorResize)
      });

      if (user['img_profile'] != 'default-user.png') {
        fs.unlinkSync(pathUser + `/${user['img_profile']}`);
        fs.unlinkSync(Thumbspath + `/${user['img_profile']}`);
      }
    }, (error) => {
      reject(error)
    })


  });


}
exports.ChangeImageProfile = async (req, res) => {
  console.log('ChangeImageProfile ...');
  // let imgList = [];
  let image = '';
  const form = new formidable.IncomingForm();
  form.maxFieldsSize = 1024 * 5000;
  form.encoding = 'utf-8';
  form.uploadDir = Temporalpath;
  form.keepExtensions = true;
  form.maxFields = 1;
  form.multiples = false;
  // form.keepExtensions = false;
  // form.type = 'png' ;

  form.on('file', async (field, file) => {
    image = file.path;
    console.log('Uploaded ' + file.path);
    // imgsTemp.push();
  });
  form.on('end', async () => {
    //Redimension images
    if (image == '') {
      res.json({
        status: false,
        type: 'error_data',
        message: 'errors',
      })
    } else {

      // MoveTempImageProfile

      this.SaveImage(req.user.id, image).then((success) => {
        Mdl_User.GetUserById(req.user.id).then((user) => {
          Token.DoToken(user).then((newToken) => {
            res.json({
              status: true,
              message: 'Todo salio bien',
              token: newToken,
            })
          }, (error) => {
            res.json({
              status: false,
              type: 'error_login',
              message: 'Imagen guardada, reinicia sesion ',
            })
          })

        }, (error) => {
          res.json({
            status: false,
            type: 'error_login',
            message: 'Imagen guardada, reinicia sesion',
          });

        });

      }, (error) => {
        console.error(error);
        res.json({
          status: false,
          type: 'error_saveimage',
          message: error,
        })
      })

    }

  });

  form.parse(req);


}

// ----------------------About
exports.GetAbout = (req, res) => {
  console.log('Get About ...');
  Mdl_User.GetAbout(req.user.id).then(async (about) => {
    res.json({
      status: true,
      type: 'ok',
      about,
    })
  }, (errors) => {
    res.json({
      status: false,
      type: 'error_about',
      message: errors,
    })
  })
}

exports.UpdateAbout = (req, res) => {
  console.log('Update About ...');
  // console.log(req.body);
  const constraints = {
    description: {
      presence: {
        message: "Falta la descripción"
      },
      length: {
        minimum: 20,
        maximum: 300,
        message: "Descripción: Mínimo 30 caracteres máximo 300."
      }
    },
    skills: {
      presence: {
        message: "Faltan las habilidades"
      },
      length: {
        minimum: 3,
        maximum: 10,
        message: "Habilidades: Mínimo 3 ,máximo 10."
      }
    },
  };

  validate.async(req.body, constraints).then((success) => {
    let About = {
      'f_id_user': req.user.id,
      'laboral_description': success['description'],
      'skills': success['skills'].toString(),
    }
    // console.log('Save About:', About);

    Mdl_User.UpdateAbout(About).then((idAbout) => {
      res.json({
        status: true,
      })
    }, (error) => {
      res.json({
        status: false,
        type: 'error_about',
        message: error,
      })
    })

  }, (error) => {
    res.json({
      status: false,
      type: 'error_data',
      message: error,
    })
  });
}
