import { Box, Button, Stack } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
            {t("contact.title")}{" "}
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
              <input
                type="text"
                placeholder={t("contact.fullName")}
                value={formState.fullName}
                onChange={handleInputChange("fullName")}
                aria-label={t("contact.fullName")}
              />
            </Box>

            <Box className="field-wrapper">
              <input
                type="tel"
                placeholder={t("contact.phoneNumber")}
                value={formState.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                aria-label={t("contact.phoneNumber")}
              />
            </Box>

            <Box className="field-wrapper">
              <input
                type="email"
                placeholder={t("contact.email")}
                value={formState.email}
                onChange={handleInputChange("email")}
                aria-label={t("contact.email")}
              />
            </Box>

            <Box className="field-wrapper">
              <input
                className="message"
                type="text"
                placeholder={t("contact.message")}
                value={formState.message}
                onChange={handleInputChange("message")}
                aria-label={t("contact.message")}
              />
            </Box>

            <Stack className="action-row" direction="row">
              <Button className="submit-btn" type="submit" variant="contained">
                {t("contact.submit")}
              </Button>
              <Button
                className="refresh-btn"
                type="button"
                variant="outlined"
                onClick={handleReset}
              >
                {t("contact.refresh")}
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Stack className="contact-visual-column">
          <Box className="visual-circle" />
          <img
            className="pets-image"
            src="/img/headers/shop-header.png"
            alt="Pets"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContactUs;
