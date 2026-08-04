import { Box, Button, Stack } from "@mui/material";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const growMessageField = (el: HTMLTextAreaElement) => {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};

interface ContactFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

const ContactField = ({ id, label, children }: ContactFieldProps) => (
  <Box className="field-wrapper">
    <label className="field-label" htmlFor={id}>
      {label}
    </label>
    <Box className="field-control">{children}</Box>
  </Box>
);

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
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange =
    (field: keyof ContactFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    growMessageField(event.target);
    setFormState((prev) => ({ ...prev, message: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleReset = () => {
    setFormState(initialFormState);
    if (messageRef.current) {
      messageRef.current.style.height = "";
    }
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
            <ContactField id="contact-fullName" label={t("contact.fullName")}>
              <input
                id="contact-fullName"
                type="text"
                value={formState.fullName}
                onChange={handleInputChange("fullName")}
              />
            </ContactField>

            <ContactField
              id="contact-phoneNumber"
              label={t("contact.phoneNumber")}
            >
              <input
                id="contact-phoneNumber"
                type="tel"
                value={formState.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
            </ContactField>

            <ContactField id="contact-email" label={t("contact.email")}>
              <input
                id="contact-email"
                type="email"
                value={formState.email}
                onChange={handleInputChange("email")}
              />
            </ContactField>

            <ContactField id="contact-message" label={t("contact.message")}>
              <textarea
                id="contact-message"
                className="message"
                ref={messageRef}
                value={formState.message}
                onChange={handleMessageChange}
                rows={1}
              />
            </ContactField>

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
