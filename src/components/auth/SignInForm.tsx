import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!tenant) {
      setError("Please select a tenant.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          username: email,
          password: password,
        },
        {
          headers: {
            tenant: tenant,
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );

      const { jwt, role, name, empId } = response.data;

     
      sessionStorage.setItem("token", jwt);
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("userId", empId);
      sessionStorage.setItem("tenant", tenant);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      let msg = "Login failed. Please try again.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        "data" in (err as any).response
      ) {
        msg = (err as any).response.data?.message || msg;
      }
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-6">
              <div>
                <Label>
                  Select Tenant <span className="text-error-500">*</span>
                </Label>
                <select
                  value={tenant}
                  onChange={(e) => setTenant(e.target.value)}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="" disabled>
                    Select a tenant
                  </option>
                  <option value="UHF">UHF</option>
                  <option value="school-123">School 123</option>
                  <option value="college-abc">College ABC</option>
                  <option value="org-xyz">Org XYZ</option>
                </select>
              </div>

              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                 
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                   
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              {error && <p className="text-sm text-error-500">{error}</p>}

              <Button className="w-full py-1 px-2 text-sm">
               Sign in
              </Button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}