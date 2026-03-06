import { Box, Button, Stack } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";

interface ContactFormState {
  fullName: string;
  phoneNumber: string;
  email: string;
  message: string;
}

const initialFormState: ContactFormState = {
  fullName: "",
  phoneNumber: "",
  email: "",
  message: "",
};

const ContactUs = () => {
  const [formState, setFormState] =
    useState<ContactFormState>(initialFormState);

  const handleInputChange =
    (field: keyof ContactFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleReset = () => {
    setFormState(initialFormState);
  };

  return (
    <Stack className="contact-us">
      <Stack className="container">
        <Stack className="contact-form-column">
          <Box className="contact-title">
            CONTACT WITH US{" "}
            <span>
              <img src="/img/logo/Union.svg" alt="" />
            </span>
          </Box>

          <Stack
            component="form"
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <Box className="field-wrapper has-label">
              {/* <span className="field-label">Full Name</span> */}
              <input
                type="text"
                placeholder="Full Name"
                value={formState.fullName}
                onChange={handleInputChange("fullName")}
                aria-label="Full Name"
              />
            </Box>

            <Box className="field-wrapper">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formState.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                aria-label="Phone Number"
              />
            </Box>

            <Box className="field-wrapper">
              <input
                type="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleInputChange("email")}
                aria-label="Email"
              />
            </Box>

            <Box className="field-wrapper">
              <input
                className="message"
                type="text"
                placeholder="Message"
                value={formState.message}
                onChange={handleInputChange("message")}
                aria-label="Message"
              />
            </Box>

            <Stack className="action-row" direction="row">
              <Button className="submit-btn" type="submit" variant="contained">
                Submit
              </Button>
              <Button
                className="refresh-btn"
                type="button"
                variant="outlined"
                onClick={handleReset}
              >
                Refresh
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Stack className="contact-visual-column">
          <Box className="visual-circle" />
          <img
            className="pets-image"
            src="./img/headers/shop-header.png"
            alt="Pets"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContactUs;
