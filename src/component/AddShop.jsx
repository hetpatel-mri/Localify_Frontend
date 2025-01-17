import React, { useState } from "react"
import axios from "axios"
import { cva } from "class-variance-authority"
import { useNavigate } from "react-router-dom"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "text-primary underline-offset-4 hover:underline": variant === "link",
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-10 w-10": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = "Select"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

function AddShop() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"))
  const [wait, setWait] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: {
      city: "",
      state: "",
      country: "",
      pincode: "",
      latitude: "",
      longitude: "",
    },
    keyPeople: [{ name: "", position: "", info: "", keyPeopleImage: null ,image:false }],
    tagline: "",
    brief_info: "",
    email: "",
    contact: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    video_url: "",
    theme: "theme_1",
    category: "",
    establishedYear: "",
    logo: null,
    banner_image: null,
    other_images: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("location")) {
      const field = name.split("[")[1].split("]")[0]
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, [field]: value },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === "logo" || name === "banner_image") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }))
    } else if (name === "other_images") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.from(files),
      }))
    } else if (name.startsWith("keyPeopleImage")) {
      const index = parseInt(name.match(/\d+/)[0], 10)
      const newKeyPeople = [...formData.keyPeople]
      newKeyPeople[index].keyPeopleImage = files[0]
      setFormData((prevData) => ({
        ...prevData,
        keyPeople: newKeyPeople,
      }))
    }
  }

  const handleKeyPeopleChange = (index, e) => {
    const { name, value } = e.target
    const updatedKeyPeople = [...formData.keyPeople]
    updatedKeyPeople[index][name] = value
    setFormData((prevData) => ({
      ...prevData,
      keyPeople: updatedKeyPeople,
    }))
  }

  const addKeyPerson = () => {
    setFormData((prevData) => ({
      ...prevData,
      keyPeople: [
        ...prevData.keyPeople,
        { name: "", position: "", info: "", keyPeopleImage: null },
      ],
    }))
  }

  const removeKeyPerson = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      keyPeople: prevData.keyPeople.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        data.append("name", formData.name);
        data.append("tagline", formData.tagline);
        data.append("brief_info", formData.brief_info);
        data.append("email", formData.email);
        data.append("contact", formData.contact);
        data.append("linkedin", formData.linkedin);
        data.append("twitter", formData.twitter);
        data.append("instagram", formData.instagram);
        data.append("video_url", formData.video_url);
        data.append("theme", formData.theme);
        data.append("establishedYear", formData.establishedYear);
        data.append("category", formData.category);
        data.append("userId",user.id);
    
        // Add location fields
        Object.keys(formData.location).forEach((key) => {
          data.append(`location[${key}]`, formData.location[key]);
        });
    
        // Add files
        if (formData.logo) data.append("logo", formData.logo);
        if (formData.banner_image) data.append("banner_image", formData.banner_image);
        formData.other_images.forEach((image) =>
          data.append("other_images", image)
        );
    
        // Add keyPeople to FormData, excluding the 'image' field
        const keyPeopleImages = [];
        formData.keyPeople.forEach((person, index) => {
          data.append(`keyPeople[${index}][name]`, person.name);
          data.append(`keyPeople[${index}][position]`, person.position);
          data.append(`keyPeople[${index}][info]`, person.info);
          const hasImage = person.keyPeopleImage ? true : false;
          data.append(`keyPeople[${index}][image]`, hasImage);
          if (person.keyPeopleImage) {
          
            keyPeopleImages.push(person.keyPeopleImage);
          }
        });
    
        keyPeopleImages.forEach((image, index) => {
          if (image) data.append('keyPeopleImages', image); // Changed here
      });
    
        const logFormData = (formData) => {
          for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
              console.log(`${key}: ${value.name}`); // For files, log the file name
            } else {
              console.log(`${key}: ${value}`); // For other values, log the value
            }
          }
        };
        
        try {
          setWait(true);
    
          logFormData(data)
          console.log(data);
          const response = await axios.post(
            `http://${import.meta.env.VITE_BACKEND_ROUTE}/api/shops/add`,
            data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setWait(false);
          // navigate("/shops")
          console.log(response.data);
        } catch (error) {
          console.error("Error adding shop:", error);
          setWait(false);
          alert("Failed to add shop");
        }
      };

  return (
    <div className="bg-gradient-to-br from-black to-purple-950  p-10 ">
    <div className="container bg-gradient-to-b from-fuchsia-900 via-blue-950 to-fuchsia-900/90 text-slate-100 rounded-lg mx-auto p-4 max-w-4xl opacity-90 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Shop</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 addShop ">
        <Card className="hover:shadow-md ">

          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brief_info">Brief Info</Label>
              <Textarea id="brief_info" name="brief_info" value={formData.brief_info} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location[city]">City</Label>
                <Input id="location[city]" name="location[city]" value={formData.location.city} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location[state]">State</Label>
                <Input id="location[state]" name="location[state]" value={formData.location.state} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location[country]">Country</Label>
                <Input id="location[country]" name="location[country]" value={formData.location.country} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location[pincode]">Pincode</Label>
                <Input id="location[pincode]" name="location[pincode]" value={formData.location.pincode} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location[latitude]">Latitude</Label>
                <Input id="location[latitude]" name="location[latitude]" type="number" step="0.01" value={formData.location.latitude} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location[longitude]">Longitude</Label>
                <Input id="location[longitude]" name="location[longitude]" type="number" step="0.01" value={formData.location.longitude} onChange={handleChange} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key People</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.keyPeople.map((person, index) => (
              <div key={index} className="space-y-4 p-4  border rounded-lg relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeKeyPerson(index)}
                >
                  Remove
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`keyPeople[${index}].name`}>Name</Label>
                    <Input
                      id={`keyPeople[${index}].name`}
                      name="name"
                      value={person.name}
                      onChange={(e) => handleKeyPeopleChange(index, e)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`keyPeople[${index}].position`}>Position</Label>
                    <Input
                      id={`keyPeople[${index}].position`}
                      name="position"
                      value={person.position}
                      onChange={(e) => handleKeyPeopleChange(index, e)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`keyPeople[${index}].info`}>Info</Label>
                  <Textarea
                    id={`keyP eople[${index}].info`}
                    name="info"
                    value={person.info}
                    onChange={(e) => handleKeyPeopleChange(index, e)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`keyPeople[${index}].image`}>Image</Label>
                  <Input
                    id={`keyPeople[${index}].image`}
                    name={`keyPeopleImage[${index}]`}
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addKeyPerson} className="w-full bg-black/60 hover:bg-black/80 p-2">
              Add Key Person
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input id="establishedYear" name="establishedYear" type="date" value={formData.establishedYear} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" name="twitter" type="url" value={formData.twitter} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" name="instagram" type="url" value={formData.instagram} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input id="video_url" name="video_url" type="url" value={formData.video_url} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select name="theme" value={formData.theme} className="bg-purple-900" onChange={handleChange}>
                <option className="bg-black/50" value="theme_1">Theme 1</option>
                <option className="bg-black/50" value="theme_2">Theme 2</option>
                <option className="bg-black/50" value="theme_3">Theme 3</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" name="logo" type="file" onChange={handleFileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner_image">Banner Image</Label>
              <Input id="banner_image" name="banner_image" type="file" onChange={handleFileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other_images">Other Images</Label>
              <Input id="other_images" name="other_images" type="file" multiple onChange={handleFileChange} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-[50px] bg-black/60 hover:bg-purple-900 border-2" disabled={wait}>
          {wait ? <p className=" text-lg
          ">Adding...</p> :<p className=" text-lg
          ">Add Shop</p>} 
        </Button>
      </form>
    </div>
    </div>
  )
}

export default AddShop;