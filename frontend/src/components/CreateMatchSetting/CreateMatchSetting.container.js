import React from 'react';
import useCreateMatchSetting from './hooks/useCreateMatchSetting';
import CreateMatchSettingView from './CreateMatchSetting.view';

const CreateMatchSettingContainer = () => {
    const {
        isEditMode,
        formData,
        publicTests,
        privateTests,
        matchDetailsExpanded,
        setMatchDetailsExpanded,
        configExpanded,
        setConfigExpanded,
        validationResults,
        alert,
        isSubmitting,
        isTrying,
        inputsList,
        handlers,
    } = useCreateMatchSetting();

    return (
        <CreateMatchSettingView
            isEditMode={isEditMode}
            formData={formData}
            publicTests={publicTests}
            privateTests={privateTests}
            matchDetailsExpanded={matchDetailsExpanded}
            configExpanded={configExpanded}
            validationResults={validationResults}
            alert={alert}
            isSubmitting={isSubmitting}
            isTrying={isTrying}
            inputsList={inputsList}
            handlers={{
                ...handlers,
                setMatchDetailsExpanded,
                setConfigExpanded,
            }}
        />
    );
};

export default CreateMatchSettingContainer;
