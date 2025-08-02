"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserData = {
  name?: string;
  rollNo?: string;
  branch?: string;
  setUser: (data: { name?: string; rollNo?: string; branch?: string }) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserData>({
  name: "",
  rollNo: "",
  branch: "",
  setUser: () => { },
  clearUser: () => { }
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const { name, rollNo, branch } = JSON.parse(storedData)
      setName(name)
      setRollNo(rollNo)
      setBranch(branch)
    }
  }, [])
  const setUser = ({ name, rollNo, branch }: { name?: string; rollNo?: string; branch?: string }) => {
    if (name !== undefined) setName(name);
    if (rollNo !== undefined) setRollNo(rollNo);
    if (branch !== undefined) setBranch(branch);
    const newUserData = {
      name: name || "",
      rollNo: rollNo || "",
      branch: branch || ""
    };
    localStorage.setItem("userData", JSON.stringify(newUserData))
  }
  const clearUser = () => {
    setName("");
    setRollNo("");
    setBranch("");
    localStorage.removeItem("userData");
  };
  return (
    <UserContext.Provider value={{ name, rollNo, branch, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
