
function errorHandler(controller,error,res){
    console.log(`error in ${controller} controller: ${error.message}`);
    return res.status(500).json({success:false,message:error.message});
}
export default errorHandler