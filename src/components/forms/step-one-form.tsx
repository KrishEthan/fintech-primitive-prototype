"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Cookies } from "react-cookie";
import { ReloadIcon } from "@radix-ui/react-icons";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";

const BASE_URL = "https://s.finprim.com/v2";

async function fetchKyc(params: Record<string, string>) {
  const formattedNumber = params.mobile.split(" ");
  const payload = {
    pan: "BAJPC4350M",
    email: params.email,
    aadhaar_number: params.aadhar_number,
    mobile: {
      isd: formattedNumber[0],
      number: formattedNumber[1],
    },
    name: "John Doe",
    date_of_birth: "1990-01-01",
  };
  const access_token = new Cookies().get("access_token");
  const response = await fetch(`${BASE_URL}/kyc_requests`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-tenant-id": "ethanai",
      "content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
}

export default function StepOneForm() {
  const [formData, setFormData] = useState({
    pan: "",
    email: "",
    aadhar_number: "",
    mobile: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        name="pan"
        placeholder="Pan"
        value={formData.pan}
        onChange={handleChange}
      />
      <Input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        name="aadhar_number"
        placeholder="Aadhar Number"
        value={formData.aadhar_number}
        onChange={handleChange}
      />
      <Input
        name="mobile"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={handleChange}
      />
    </div>
  );
}
