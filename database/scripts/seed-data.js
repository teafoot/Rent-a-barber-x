// let posts = [];
// for (let i = 0; i < 5000; i += 1) {
//     let newPost = {
//         title: faker.lorem.words(7),
//         body: faker.lorem.words(500),
//         author: _.sample(users), // use lodash to pick a random user as the author of this post
//         likes: _.sampleSize(users, Math.round(Math.random * users.length)).map( // use lodash to add a random subset of the users to this post
//             user => user._id
//         )
//     };
//     posts.push(newPost);
//     console.log(newPost.title);
// }
// postsCollection.insertMany(posts);