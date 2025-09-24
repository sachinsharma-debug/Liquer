import React, { useState, useEffect,useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import showToast from "@/components/reusableComponents/ToasterAlert";
import { BASE_URL,globalsearchcountry,globalsearchstate } from "@/api/BaseUrl";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";





// import 'select2/dist/css/select2.min.css';
// import 'select2/dist/js/select2.min.js'; // or 'select2/dist/js/select2.min.js'
// import $ from 'jquery';


export default function Organization() {
  const selectRef = useRef(null);
  const [managementType, setManagementType] = useState("");
  const [modalOpen, setModalopen] = useState(false);
  const [companyManagement, setCompanyManagement] = useState({
    CompanyID: "",
    companyCode: "",
    masterId: "",
    alternateId: "",
    companyName: "",
    mailingName: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    mobile: "",
    telephone: "",
    email: "",
    website: "",
    currencySymbol: "",
    formalName: "",
    financialYear: "",
    booksBeginning: "",
  });
  const [companies, setCompanies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyManagement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (value) => {
    const selectedCountry = countries.find(country => country.isoCode === value);
    setCompanyManagement(prev => ({
      ...prev,
      country: selectedCountry ? selectedCountry.name : value,
    }));

    // Update states based on selected country
    const countryStates = State.getStatesOfCountry(value);
    setStates(countryStates);

    // Reset state and cities when country changes
    setCompanyManagement(prev => ({
      ...prev,
      state: "",
    }));
    setCities([]);
  };

  const handleStateChange = (value) => {
    const selectedState = states.find(state => state.isoCode === value);
    setCompanyManagement(prev => ({
      ...prev,
      state: selectedState ? selectedState.name : value,
    }));

    // Update cities based on selected state and country
    const countryCode = countries.find(country =>
      country.name === companyManagement.country
    )?.isoCode;

    if (countryCode) {
      const stateCities = City.getCitiesOfState(countryCode, value);
      setCities(stateCities);
    }
  };


  



  const handleManageCompany = async (managementType: any) => {
    const Company_Details = {
      Company_Name: companyManagement.companyName,
      Mailing_name: companyManagement.mailingName,
      Address: companyManagement.address,
      State: companyManagement.state,
      Country: companyManagement.country,
      Pincode: companyManagement.pinCode,
      Mobile_No: companyManagement.mobile,
      TelePhone: companyManagement.telephone,
      "E-mail_Id": companyManagement.email,
      Website: companyManagement.website,
      Base_Currency: companyManagement.currencySymbol,
      Formal_Name: companyManagement.formalName,
      Financial_Year: companyManagement.financialYear,
      Books_Beginning: companyManagement.booksBeginning,
      Company_Code: companyManagement.companyCode,
      masterId: companyManagement.masterId,
      alternateId: companyManagement.alternateId,
    };

    try {
      let response: any;
      if (managementType === "Update") {
        response = await axios.patch(BASE_URL + "update_company_data", {
          id: companyManagement.CompanyID,
          Company_Details: Company_Details,
        });
      } else {
        response = await axios.post(BASE_URL + "create_company", {
          Company_Details: Company_Details,
        });
      }
      if (response?.data?.status === 201 || response?.data?.status === 200) {
        setModalopen(false);
        fetchCompanies();
        showToast(response?.data?.message, "success");
        // Reset form
        setCompanyManagement({
          CompanyID: "",
          companyCode: "",
          masterId: "",
          alternateId: "",
          companyName: "",
          mailingName: "",
          address: "",
          state: "",
          country: "",
          pinCode: "",
          mobile: "",
          telephone: "",
          email: "",
          website: "",
          currencySymbol: "",
          formalName: "",
          financialYear: "",
          booksBeginning: "",
        });
      }
    } catch (error) {
      showToast(error?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    fetchCompanies();
    // Load countries
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    // When country is set (from edit), load its states
    if (companyManagement.country) {
      const countryCode = countries.find(country =>
        country.name === companyManagement.country
      )?.isoCode;

      if (countryCode) {
        const countryStates = State.getStatesOfCountry(countryCode);



             globalsearchstate(modalOpen,".statete",handleStateChange)



        setStates(countryStates);
      }
    }
  }, [companyManagement.country, countries]);
 
  useEffect(() => {
 
    globalsearchcountry(modalOpen,".sachin",".statete",handleCountryChange)
    
  },[modalOpen]);


  useEffect(() => {
    // When state is set (from edit), load its cities
    if (companyManagement.state && companyManagement.country) {
      const countryCode = countries.find(country =>
        country.name === companyManagement.country
      )?.isoCode;

      if (countryCode) {
        const stateCode = states.find(state =>
          state.name === companyManagement.state
        )?.isoCode;

        if (stateCode) {
          const stateCities = City.getCitiesOfState(countryCode, stateCode);
          setCities(stateCities);
        }
      }
    }
  }, [companyManagement.state, companyManagement.country, countries, states]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(BASE_URL + "getcompany ");
      if (response.status === 200) {
        setCompanies(response?.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      showToast("Failed to load companies", "error");
    }
  };

  const handleEditCompany = (company: any) => {
    // Format dates for the date inputs (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setCompanyManagement({
      CompanyID: company._id || "",
      companyCode: company.Company_Code || "",
      masterId: company.masterId || "",
      alternateId: company.alternateId || "",
      companyName: company.Company_Name || "",
      mailingName: company.Mailing_name || "",
      address: company.Address || "",
      state: company.State || "",
      country: company.Country || "",
      pinCode: company.Pincode || "",
      mobile: company.Mobile_No || "",
      telephone: company.TelePhone || "",
      email: company["E-mail_Id"] || "",
      website: company.Website || "",
      currencySymbol: company.Base_Currency || "",
      formalName: company.Formal_Name || "",
      financialYear: formatDateForInput(company.Financial_Year),
      booksBeginning: formatDateForInput(company.Books_Beginning),
    });
    setModalopen(true);
    setManagementType("Update");
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      const res = await axios.delete(`${BASE_URL}deleteCompanyById/${id}`);
      if (res?.status === 200) {
        showToast(res?.data?.message, "success");
        fetchCompanies();
      }
    } catch (err: any) {
      showToast("Failed to delete company", "error");
    }
  };

  const renderStateSpecificFields = () => {
    switch (companyManagement.state.toLowerCase()) {
      case "uttar pradesh":
        return (
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <div className="text-xs text-blue-700">
              Additional state-specific requirements may apply for Uttar Pradesh.
            </div>
          </div>
        );
      case "maharashtra":
        return (
          <div className="mt-2 p-2 bg-green-50 rounded-md">
            <div className="text-xs text-green-700">
              Additional state-specific requirements may apply for Maharashtra.
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-700">
              No state-specific requirements for {companyManagement.state || "this state"}.
            </div>
          </div>
        );
    }
  };




  //  console.log( window.$('#myselect'),">>>>>>>>>>>")

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Structure
          </h1>
          <Button
            onClick={() => {
              setManagementType("Add");
              setModalopen(true);
            }}
          >
            Add Company
          </Button>
        </div>
        <Dialog open={modalOpen} onOpenChange={(open) => setModalopen(open)}>
          <DialogTrigger asChild>
            {/* <Button>Add Company</Button> */}
          </DialogTrigger>

          <DialogContent className="max-w-7xl max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {managementType} Company Profile
              </DialogTitle>
            </DialogHeader>

            <div className="flex gap-4 mt-2">
              {/* Left Side - Company Information */}
              <div className="flex-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="companyCode"
                      className="text-xs w-32 text-right"
                    >
                      Company Code:
                    </Label>
                    <Input
                      id="companyCode"
                      name="companyCode"
                      placeholder="Company Code"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.companyCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="masterId" className="text-xs w-32 text-right">
                      Master Id:
                    </Label>
                    <Input
                      id="masterId"
                      name="masterId"
                      placeholder="Master Id"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.masterId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="alterId" className="text-xs w-32 text-right">
                      Alter Id:
                    </Label>
                    <Input
                      id="alterId"
                      name="alterId"
                      placeholder="Alter Id"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.alterId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="companyName"
                      className="text-xs w-32 text-right"
                    >
                      Company Name:
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Company Name"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="mailingName"
                      className="text-xs w-32 text-right"
                    >
                      Mailing Name:
                    </Label>
                    <Input
                      id="mailingName"
                      name="mailingName"
                      placeholder="Mailing Name"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.mailingName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="address" className="text-xs w-32 text-right">
                      Address:
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Company Address"
                      className="h-6 text-xs resize-none flex-1"
                      value={companyManagement.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="country" className="text-xs w-32 text-right">
                      Country:
                    </Label>
                    <select className="sachin h-6 text-xs flex-1 " onChange={(e) => {
                      handleCountryChange(e.target.value)
                    }} value={countries.find(c => c.name === companyManagement.country)?.isoCode || ""}>



                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}

                    </select>
                    {/* <Select
                  
           
                    value={countries.find(c => c.name === companyManagement.country)?.isoCode || ""}
                    onValueChange={handleCountryChange}


                  
                 >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="state" className="text-xs w-32 text-right">
                      State:
                    </Label>
                    <select className=" statete h-6 text-xs flex-1 "
                      onChange={(e) => {
                          handleStateChange(e.target.value)
                        }}value={states.find(s => s.name === companyManagement.state)?.isoCode || ""}
                        // disabled={!formData.clientCountry}
                    >
                      {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                    </select>
                    {/* <Select
                      value={states.find(s => s.name === companyManagement.state)?.isoCode || ""}
                      onValueChange={handleStateChange}
                      disabled={!companyManagement.country}
                    >
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {states.map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pinCode" className="text-xs w-32 text-right">
                      PinCode:
                    </Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      placeholder="Pincode"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.pinCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="mobile" className="text-xs w-32 text-right">
                      Mobile:
                    </Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      placeholder="+91 9876543210"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.mobile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="telephone"
                      className="text-xs w-32 text-right"
                    >
                      TelePhone:
                    </Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      placeholder="1234567890"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.telephone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-2">{renderStateSpecificFields()}</div>
                </div>
              </div>

              {/* Vertical Grey Separator Line */}
              <div className="flex justify-center px-4">
                <div className="border-l-2 border-gray-300 h-full"></div>
              </div>

              {/* Right Side - Date Information */}
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="financialYear"
                      className="text-xs w-20 text-right"
                    >
                      Financial Year:
                    </Label>
                    <Input
                      id="financialYear"
                      name="financialYear"
                      type="date"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.financialYear || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="booksBeginning"
                      className="text-xs w-20 text-right"
                    >
                      Books Begin:
                    </Label>
                    <Input
                      id="booksBeginning"
                      name="booksBeginning"
                      type="date"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.booksBeginning || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email" className="text-xs w-20 text-right">
                      Email:
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="rk@gmail.com"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="website" className="text-xs w-20 text-right">
                      Website:
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="www.google.com"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.website}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="currencySymbol"
                      className="text-xs w-20 text-right"
                    >
                      Base Currency:
                    </Label>
                    <Input
                      id="currencySymbol"
                      name="currencySymbol"
                      placeholder="Rs..."
                      className="h-6 text-xs flex-1"
                      value={companyManagement.currencySymbol}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="formalName"
                      className="text-xs w-20 text-right"
                    >
                      Formal Name:
                    </Label>
                    <Input
                      id="formalName"
                      name="formalName"
                      placeholder="INR"
                      className="h-6 text-xs flex-1"
                      value={companyManagement.formalName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-end mt-3">
              <Button
                className="h-8 text-sm px-4"
                onClick={() => {
                  handleManageCompany(managementType);
                }}
              >
                {managementType} Company Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {companies.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Company Name</th>
                  <th className="px-4 py-2 border-b">Mailing Name</th>
                  <th className="px-4 py-2 border-b">Address</th>
                  <th className="px-4 py-2 border-b">State</th>
                  <th className="px-4 py-2 border-b">Country</th>
                  <th className="px-4 py-2 border-b">Pincode</th>
                  <th className="px-4 py-2 border-b">Mobile</th>
                  <th className="px-4 py-2 border-b">Telephone</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Website</th>
                  <th className="px-4 py-2 border-b">Currency</th>
                  <th className="px-4 py-2 border-b">Formal Name</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 text-sm">
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{company.Company_Name}</td>
                    <td className="px-4 py-2 border-b">{company.Mailing_name}</td>
                    <td className="px-4 py-2 border-b">{company.Address}</td>
                    <td className="px-4 py-2 border-b">{company.State}</td>
                    <td className="px-4 py-2 border-b">{company.Country}</td>
                    <td className="px-4 py-2 border-b">{company.Pincode}</td>
                    <td className="px-4 py-2 border-b">{company.Mobile_No}</td>
                    <td className="px-4 py-2 border-b">{company.TelePhone}</td>
                    <td className="px-4 py-2 border-b">{company["E-mail_Id"]}</td>
                    <td className="px-4 py-2 border-b">{company.Website}</td>
                    <td className="px-4 py-2 border-b">
                      {company.Base_Currency}
                    </td>
                    <td className="px-4 py-2 border-b">{company.Formal_Name}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center space-x-2">
                        <Pencil
                          size={18}
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEditCompany(company)}
                        />
                        <Trash2
                          size={18}
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteCompany(company._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}





      </div>

    </>
  );
}