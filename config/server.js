// module.exports ={
//     'database': '"mongodb://"+process.env.IP+"/mydb"',
//     'secret': 'autumncatissingingmeowsongs'
// };

module.exports ={
    'database': { 
        'development': "mongodb://"+process.env.IP+"/mydb",
        'test': "mongodb://"+process.env.IP+"/mytest"
},
    'secret': 'itisraininghere'
};