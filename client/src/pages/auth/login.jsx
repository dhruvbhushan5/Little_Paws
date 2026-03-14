import Commonform from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState={
    email:'',
    password:''
}
function AuthLogin() {
    const [formData,setFormData]=useState(initialState)
    const dispatch= useDispatch();
    const {toast}=useToast();
    function onSubmit(event){
        event.preventDefault();
        dispatch(loginUser(formData)).then(data=>{
            if (data?.payload?.success) {
                toast({
                  title: data?.payload?.message,
                });
              } else {
                toast({
                  title: data?.payload?.message,
                  variant: "destructive",
                });
              }
        })
    }
    return ( 
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">Sign in to your account</h1>
                <p className="mt-2 text-slate-600">Don't have an account
                    <Link className="ml-2 font-medium text-sky-700 hover:underline" to='/auth/register'>Register</Link>
                </p>
            </div>
            <Commonform
            formControls={loginFormControls}
            buttonText={'Sign In'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
        </div>

    //     <div className="mx-auto w-full max-w-md space-y-6 mt-12 bg-white p-8 rounded-lg shadow-md">
    //     <div className="text-center">
    //       <h1 className="text-3xl font-bold tracking-tight text-gray-900">
    //         Sign in to your account
    //       </h1>
    //       <p className="mt-2 text-sm text-gray-600">
    //         Don't have an account{' '}
    //         <Link
    //           className="font-medium ml-2 text-indigo-600 hover:text-indigo-500"
    //           to="/auth/register"
    //         >
    //           Register
    //         </Link>
    //       </p>
    //     </div>
    //     <Commonform
    //       formControls={loginFormControls}
    //       buttonText={'Sign In'}
    //       formData={formData}
    //       setFormData={setFormData}
    //       onSubmit={onSubmit}
    //     />
    //   </div>

    );
}

export default AuthLogin;
