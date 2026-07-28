import React, { useState } from "react";
import { Stack, Tab, Tabs, Box, Button } from "@mui/material";
import PersonalInfo from "../mypage/PersonalInfo";
import BillingInfo from "../mypage/BillingInfo";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [cancelTrigger, setCancelTrigger] = useState(0);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setIsEditable(false); // also exit edit mode on tab change
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleCancel = () => {
    setCancelTrigger((prev) => prev + 1);
    setIsEditable(false);
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveTrigger((prev) => prev + 1);
  };

  const handleSaveComplete = (succeeded: boolean) => {
    setIsSaving(false);
    if (succeeded) setIsEditable(false);
  };

  return (
    <Stack className="my-profile-container" spacing={4}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="profile-tabs-wrapper"
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="profile tabs"
        >
          <Tab label="Personal Info" />
          <Tab label="Billing Info" />
        </Tabs>

        <Stack direction="row" spacing={2} className="action-buttons">
          {isEditable ? (
            <>
              <Button
                variant="outlined"
                color="error"
                className="btn-cancel"
                startIcon={<CloseIcon />}
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="btn-save"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              className="btn-edit"
              startIcon={<EditIcon />}
              onClick={toggleEdit}
            >
              {activeTab === 0 ? "Edit Profile Info" : "Edit Billing Info"}
            </Button>
          )}
        </Stack>
      </Stack>

      <Box className="tab-content">
        {activeTab === 0 && (
          <PersonalInfo
            isEditable={isEditable}
            cancelTrigger={cancelTrigger}
            saveTrigger={saveTrigger}
            onSaveComplete={handleSaveComplete}
          />
        )}
        {activeTab === 1 && (
          <BillingInfo
            isEditable={isEditable}
            cancelTrigger={cancelTrigger}
            saveTrigger={saveTrigger}
            onSaveComplete={handleSaveComplete}
          />
        )}
      </Box>
    </Stack>
  );
};

export default MyProfile;
