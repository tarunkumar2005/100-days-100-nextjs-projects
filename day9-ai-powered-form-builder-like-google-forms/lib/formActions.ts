import { FormField, APIResponse } from '@/types/form';

export function handleFormAction(currentFields: FormField[], action: APIResponse): FormField[] {
  switch (action.action) {
    case 'createForm':
      return action.fields || [];

    case 'addField':
      if (action.field) {
        return [...currentFields, action.field];
      }
      break;

    case 'editLabel':
      if (action.fieldName && action.field?.label) {
        return currentFields.map(field => 
          field.name === action.fieldName && action.field ? { ...field, label: action.field.label } : field
        );
      }
      break;

    case 'addPlaceholder':
      if (action.fieldName && action.field?.placeholder) {
        return currentFields.map(field => 
          field.name === action.fieldName && action.field ? { ...field, placeholder: action.field.placeholder } : field
        );
      }
      break;

    case 'setValidation':
      if (action.fieldName && action.field?.validation) {
        return currentFields.map(field => 
          field.name === action.fieldName && action.field ? { ...field, validation: action.field.validation } : field
        );
      }
      break;

    case 'addOptions':
      if (action.fieldName && action.field?.options) {
        return currentFields.map(field => 
          field.name === action.fieldName && action.field ? { ...field, options: action.field.options } : field
        );
      }
      break;

    case 'reorderFields':
      if (action.reorderInstructions) {
        const newOrder = action.reorderInstructions.split(',').map(name => name.trim());
        return newOrder.map(name => currentFields.find(field => field.name === name)!).filter(Boolean);
      }
      break;

    case 'deleteField':
      if (action.fieldName) {
        return currentFields.filter(field => field.name !== action.fieldName);
      }
      break;

    case 'addSection':
      if (action.sectionTitle) {
        return [...currentFields, { type: 'section', label: action.sectionTitle, name: `section-${Date.now()}`, required: false }];
      }
      break;

    case 'enableField':
    case 'disableField':
      if (action.fieldName) {
        return currentFields.map(field => 
          field.name === action.fieldName ? { ...field, disabled: action.action === 'disableField' } : field
        );
      }
      break;

    case 'setConditionalLogic':
      if (action.fieldName && action.field?.conditionalLogic) {
        return currentFields.map(field => 
          field.name === action.fieldName && action.field ? { ...field, conditionalLogic: action.field.conditionalLogic } : field
        );
      }
      break;

    default:
      console.warn('Unhandled action type:', action.action);
  }
  return currentFields;
}