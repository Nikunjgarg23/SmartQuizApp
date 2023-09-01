




app.post('/teacher/create',function(req,res){
    if(req.body.password != req.body.confirm_pass){
        return res.redirect('back');
    }
    const find = async()=>{
        try{
            const user = await Teacher.findOne({email : req.body.email});

            if(!user){
                const data = new Teacher(req.body);
                data.save();
                return res.redirect('/teacher'); // change to signup page later
            }
            else{
                return res.redirect('/teacher/signup');
            }
        }
        catch(err){
            console.log(err);
        }
    }
    find();
});
