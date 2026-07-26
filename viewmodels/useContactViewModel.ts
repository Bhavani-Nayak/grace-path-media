"use client";

import { useState, useCallback } from "react";
import { submitContactForm } from "@/services/contact-service";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  slug: string;
}

const initialForm: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  slug: "general-enquiry",
};

export function useContactViewModel() {
  const [formData, setFormData] = useState<ContactFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const submit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await submitContactForm(formData);
      setIsSubmitted(true);
      setFormData(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return { formData, setField, submit, isSubmitting, isSubmitted, error };
}

