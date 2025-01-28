import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import MarkersCustomFields from './components/MarkersCustomFields';
import mutateEditViewHook from "./hooks/mutate-edit-view";


export default {
  register(app) {
    app.addFields({
      Component: MarkersCustomFields,
      type: PLUGIN_ID,
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },
  bootstrap(app) {
    app.registerHook(
      "Admin/CM/pages/EditView/mutate-edit-view-layout",
      mutateEditViewHook,
    );
  },
  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
