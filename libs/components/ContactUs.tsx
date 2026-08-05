import { Box, Button, Stack } from "@mui/material";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../types/common";
import { Messages } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

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

  async function handleSubmit(e: T) {
    e.preventDefault();
    try {
      const { fullName, phoneNumber, email, message } = formState;
      if (
        !fullName.trim() ||
        !phoneNumber.trim() ||
        !email.trim() ||
        !message.trim()
      ) {
        throw new Error(Messages.error3);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_CONTACT_US_ACCESS_KEY,
          name: e.target.fullName.value,
          phoneNumber: e.target.phoneNumber.value,
          email: e.target.email.value,
          message: e.target.message.value,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || Messages.error1);
      }
      handleReset();
      await sweetBottomSmallSuccessAlert(t("contact.success"), 5500);
    } catch (err: any) {
      console.log("ERROR, contact handleSubmit:", err.message);
      await sweetMixinErrorAlert(err.message || t("contact.error"));
    }
  }

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
                type="text"
                name="fullName"
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
                name="phoneNumber"
                value={formState.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
            </ContactField>

            <ContactField id="contact-email" label={t("contact.email")}>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange("email")}
              />
            </ContactField>

            <ContactField id="contact-message" label={t("contact.message")}>
              <textarea
                id="contact-message"
                className="message"
                name="message"
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
