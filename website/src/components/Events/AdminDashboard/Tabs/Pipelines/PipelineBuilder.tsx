import React, { useEffect, useState } from "react";
import PipelineActionModal from "./PipelineActionModal";
import { PipelineAction, PipelineConfiguration, PipelineEvent } from "@/types/models/Pipeline";
import { EventModel } from "@/types/models/Event";
import { FormStructure } from "@/types/models/Form";
import { getEventForms } from "@/services/EventService";
import { EmailTemplate } from "@/types/models/EmailTemplate";
import { GetEmailTemplates } from "@/services/EmailTemplateService";

interface PipelineBuilderProps {
  pipeline: PipelineConfiguration;
  onSubmit: (pipeline: PipelineConfiguration) => void;
  eventDetails: EventModel;
}

const PipelineBuilder: React.FC<PipelineBuilderProps> = ({
  pipeline,
  onSubmit,
  eventDetails,
}) => {
  const [pipelineConfig, setPipelineConfig] =
    useState<PipelineConfiguration>(pipeline);
  const [showModalType, setShowModalType] = useState<"action" | "event" | null>(
    null
  );
  const [deleteAction, setDeleteAction] = useState<PipelineAction>();
  const [eventForms, setEventForms] = useState<FormStructure[]>();
  const [eventEmailTemplates, setEventEmailTemplates] = useState<EmailTemplate[]>();
  const [editAction, setEditAction] = useState<PipelineAction>();

    useEffect(() => {
      if (editAction) {
        setShowModalType("action");
    }
    }, [editAction]);


  const handleFormSubmit = () => {
    onSubmit(pipelineConfig);
  };

  useEffect(() => {
    if (eventDetails !== null) {
      getEventForms(eventDetails.ID)
        .then((f) => {
          setEventForms(f.data.forms);
        })
        .catch(() => {});

      GetEmailTemplates(eventDetails.ID)
        .then((f) => {
          setEventEmailTemplates(f.data.email_templates);
        })
        .catch(() => {});
    }
  }, [eventDetails])

  const handleAddAction = (action: PipelineAction | PipelineEvent) => {
    setPipelineConfig((prevConfig) => {
      const safePrevConfig = prevConfig ?? { actions: [] };
  
      // Check if the action already exists in the list
      const existingIndex = safePrevConfig.actions?.findIndex((a) => a.id === action.id);
  
      // If the action exists, replace it with the new action, otherwise add the new action
      let updatedActions;
      if (existingIndex && existingIndex >= 0) {
        updatedActions = safePrevConfig.actions?.map((a, index) =>
          index === existingIndex ? (action as PipelineAction) : a
        );
      } else {
        updatedActions = [...(safePrevConfig.actions || []), action as PipelineAction];
      }
  
      return {
        ...safePrevConfig,
        actions: updatedActions,
      };
    });
  };
  

  const handleRemoveAction = (action: PipelineAction) => {
    setDeleteAction(undefined);
    setPipelineConfig((prevConfig) => ({
      ...prevConfig,
      actions: prevConfig.actions?.filter((a) => a !== action),
    }));
  };

  const handleSetEvent = (event: PipelineEvent | PipelineAction) => {
    setPipelineConfig((prevConfig) => ({
      ...prevConfig,
      event: event as PipelineEvent,
    }))
  };

  // TODO: Pre-populate the email action & form id to be a selector 
  return (
    <>
      <h2 className="text-lg">Pipeline Trigger</h2>

      {pipelineConfig.event && pipelineConfig.event.name && (
        <div className="overflow-x-auto mt-4">
          <table className="table table-pin-rows table-pin-cols bg-white">
            <thead>
              <tr>
                <td>Type</td>
                <td>Details</td>
              </tr>
            </thead>
            <tbody>
              <tr className="hover cursor-pointer">
                <td>{pipelineConfig.event.name}</td>
                <td>{JSON.stringify(pipelineConfig.event, null, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {pipelineConfig.event && !pipelineConfig.event.name && (
        <p>No event configured.</p>
      )}

      <p>
        <button
          onClick={() => setShowModalType("event")}
          className="btn btn-primary mt-4"
        >
          {pipelineConfig.event?.name ? "Edit Event" : "Set Event"}
        </button>
      </p>

      <PipelineActionModal
        isOpen={showModalType === "event"}
        onClose={() => setShowModalType(null)}
        onSelect={handleSetEvent}
        modalType="event"
        eventForms={eventForms}
        eventEmailTemplates={eventEmailTemplates}
        defaultEvent={pipelineConfig.event}
      />

      <h2 className="text-lg mt-4">Pipeline Actions</h2>
      {pipelineConfig &&
        pipelineConfig.actions &&
        pipelineConfig.actions.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="table table-pin-rows table-pin-cols bg-white">
              <thead>
                <tr>
                  <td>Type</td>
                  <td>Details</td>
                  <td></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {pipelineConfig.actions?.map((action, index) => {
                  return (
                    <tr key={index} className="hover cursor-pointer">
                      <td>{action.type}</td>
                      <td>{JSON.stringify(action, null, 2)}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditAction(action)
                          }}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteAction(action);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      <p>
        <button
          onClick={() => setShowModalType("action")}
          className="btn btn-primary mt-4"
        >
          Add Action
        </button>
      </p>

      <p>
        <button
          onClick={handleFormSubmit}
          className="btn btn-primary mt-4"
        >
          Save Pipeline
        </button>
      </p>

      <PipelineActionModal
        isOpen={showModalType === "action"}
        onClose={() => {
          setEditAction(undefined)  
          setShowModalType(null)
        }}
        onSelect={handleAddAction}
        modalType="action"
        eventForms={eventForms}
        eventEmailTemplates={eventEmailTemplates}
        defaultAction={editAction}
        key={editAction?.type} // Force re-render when editing an action
      />

      {deleteAction && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this action?
            </h3>
            <p className="lext-lg mb-2 mt-1">Type: {deleteAction.type}</p>
            <p>{JSON.stringify(deleteAction, null, 2)}</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => handleRemoveAction(deleteAction)}
              >
                Delete
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setDeleteAction(undefined)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PipelineBuilder;
