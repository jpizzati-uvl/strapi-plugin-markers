import { PLUGIN_ID } from "../pluginId";

/**
 * Checks if the field in the layout's row has the url-image enabled.
 * @param {array} layouts - The layouts in the current content-type
 * @returns {array} - The updated layouts
 */

const mutateLayouts = (layouts: any) => {
  return layouts.map((row) => {
    const mutatedRow = row.map((fields) => {
      return fields.reduce((acc, field) => {
        const hasMapFieldEnabled = field.attribute?.pluginOptions?.[PLUGIN_ID]?.enabled;

        if (hasMapFieldEnabled) {
          return [...acc, {
            ...field,
            type: PLUGIN_ID,
            attribute: {
              ...field.attribute,
              type: PLUGIN_ID
            }
          }]
        }

        return [...acc, field];
      }, [])
    });

    return mutatedRow;
  });
};

/**
 * Behaviours triggered by the 'Admin/CM/pages/EditView/mutate-edit-view-layout' hook.
 */

const mutateEditViewHook = (data: any) => {
  const mutateEditLayout = mutateLayouts(data.layout.layout);
  const mutatedData = {
    ...data,
    layout: {
      ...data.layout,
      layout: mutateEditLayout
    }
  };

  return mutatedData;
};

export default mutateEditViewHook;
