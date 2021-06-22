const router = require('express').Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',
        ],
        include: [
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
      // remember to always include promise to capture reponse from db call
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// GET a single post
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at'
      ],
      include: [
        // include the Comment model here:
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
    ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});
// Create a Post
router.post('/', withAuth, (req, res) => {
    Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id
      // Sequelize will add created_at and updated_at
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});
// Update Post's Title and content 
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
          title: req.body.title,
          post_text: req.body.post_text
        }, 
        {
          where: {
           id: req.params.id
          } 
        }
    )
        .then(dbUserData => {
          if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});
// // Update Post's Content
// router.put('/:id', withAuth, (req, res) => {
//     Post.update(
//         {
//           post_text: req.body.post_text
//         }, 
//         {
//           where: {
//            id: req.params.id
//           } 
//         }
//     )
//         .then(dbUserData => {
//           if (!dbUserData[0]) {
//             res.status(404).json({ message: 'No user found with this id' });
//             return;
//           }
//           res.json(dbUserData);
//         })
//         .catch(err => {
//           console.log(err);
//           res.status(500).json(err);
//         });
// });
// delete a Post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;