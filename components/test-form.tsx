"use client";

import React from "react";
import { DynamicForm, FieldConfig } from "./dynamic-form";
import { Button } from "./ui/button";

const FormExample = () => {
  // Handle image selection for cover photo
  const handleCoverPhotoSelect = (file: File) => {
    console.log("Cover photo selected:", file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      console.log("Base64:", base64String);
    };
    reader.readAsDataURL(file);
  };

  // Handle image selection for logo
  const handleLogoSelect = (file: File) => {
    console.log("Logo selected:", file);
  };

  // Handle currency change
  const handleCurrencyChange = (value: string) => {
    console.log("Currency changed:", value);
  };

  // Single form fields configuration
  const formFields: FieldConfig[] = [
    {
      name: "title",
      label: "Event Title",
      type: "input",
      required: true,
      placeholder: "Enter event title",
      className: "col-span-2",
    },
    {
      name: "description",
      label: "Event Description",
      type: "joditEditor", // Using Jodit Editor
      required: true,
      placeholder: "Write your event description here...",
      className: "col-span-2",
    },
    {
      name: "category",
      label: "Event Category",
      type: "select",
      required: true,
      options: [
        { label: "Conference", value: "conference" },
        { label: "Workshop", value: "workshop" },
        { label: "Meetup", value: "meetup" },
        { label: "Webinar", value: "webinar" },
      ],
      placeholder: "Select a category",
      className: "col-span-1",
    },
    {
      name: "eventType",
      label: "Event Type",
      type: "radio",
      required: true,
      options: [
        { label: "In-Person", value: "in-person" },
        { label: "Virtual", value: "virtual" },
        { label: "Hybrid", value: "hybrid" },
      ],
      className: "col-span-2",
    },
    {
      name: "isPaid",
      label: "Paid Event",
      type: "switch",
      className: "col-span-1",
    },
    {
      name: "ticketPrice",
      label: "Ticket Price",
      type: "currencyInput",
      required: true,
      defaultCurrency: "USD",
      onCurrencyChange: handleCurrencyChange,
      className: "col-span-1",
    },
    {
      name: "contactPhone",
      label: "Contact Phone",
      type: "countryPhone",
      required: true,
      placeholder: "Enter contact phone number",
      className: "col-span-2",
    },
    {
      name: "logo",
      label: "Event Logo",
      type: "logo",
      required: true,
      className: "col-span-1",
    },
    {
      name: "coverPhoto",
      label: "Cover Photo",
      type: "cover",
      required: true,
      onImageSelect: handleCoverPhotoSelect,
      className: "col-span-2",
    },
  ];

  // Multi-step form configuration
  const multiStepConfig: any[] = [
    {
      title: "Basic Information",
      fields: [
        {
          name: "title",
          label: "Event Title",
          type: "input",
          required: true,
          placeholder: "Enter event title",
        },
        {
          name: "description",
          label: "Event Description",
          type: "joditEditor", // Using Jodit Editor
          required: true,
          placeholder: "Write your event description here...",
        },
        {
          name: "category",
          label: "Event Category",
          type: "select",
          required: true,
          options: [
            { label: "Conference", value: "conference" },
            { label: "Workshop", value: "workshop" },
            { label: "Meetup", value: "meetup" },
          ],
        },
      ],
    },
    {
      title: "Event Details",
      fields: [
        {
          name: "eventType",
          label: "Event Type",
          type: "radio",
          required: true,
          options: [
            { label: "In-Person", value: "in-person" },
            { label: "Virtual", value: "virtual" },
            { label: "Hybrid", value: "hybrid" },
          ],
        },
        {
          name: "isPaid",
          label: "Paid Event",
          type: "switch",
        },
        {
          name: "ticketPrice",
          label: "Ticket Price",
          type: "currencyInput",
          required: true,
          defaultCurrency: "USD",
        },
      ],
    },
    {
      title: "Contact & Media",
      fields: [
        {
          name: "contactPhone",
          label: "Contact Phone",
          type: "countryPhone",
          required: true,
        },
        {
          name: "logo",
          label: "Event Logo",
          type: "logo",
          required: true,
        },
        {
          name: "coverPhoto",
          label: "Cover Photo",
          type: "cover",
          required: true,
          onImageSelect: handleCoverPhotoSelect,
        },
      ],
    },
  ];

  // Form submission handlers
  const handleSingleFormSubmit = (data: any) => {
    console.log("Single Form Data:", data);
    // Handle form submission
  };

  const handleMultiStepFormSubmit = (data: any) => {
    console.log("Multi-Step Form Data:", data);
    // Handle form submission
  };

  // Default values for update mode
  const defaultValues = {
    title: "Sample Event",
    description: "<p>This is a sample event description</p>", // HTML content for Jodit editor
    category: "conference",
    eventType: "in-person",
    isPaid: true,
    ticketPrice: "100",
    contactPhone: "+1234567890",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Single Form Example */}
      <div className=" p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Single Form Example</h2>
        <DynamicForm
          fields={formFields}
          onSubmit={handleSingleFormSubmit}
          parentClassName="grid grid-cols-2 gap-6"
          defaultValues={defaultValues}
          isUpdateMode={true}
          formId="idss"
        />
        <Button form="idss" type="submit" className="w-full mt-4">
          Create Event
        </Button>
      </div>

      {/* Multi-Step Form Example
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Multi-Step Form Example</h2>
        <DynamicForm
          steps={multiStepConfig}
          onSubmit={handleMultiStepFormSubmit}
          parentClassName="grid gap-6"
          formId="multi-step-form"
        />
      </div> */}
    </div>
  );
};

export default FormExample;
