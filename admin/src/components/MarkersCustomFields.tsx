// TODO: 
// 1.Fix position of the marker pointer on y axis
// 2.Add MediaLibraryInput and CKEditorInput components

import { useState, useRef, useEffect } from 'react';
import {
  Grid,
  Flex,
  Box,
  Tabs,
  Toggle,
  Button,
  TextInput,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
// import { MediaLibraryInput } from '@strapi/plugin-upload/admin/src/components/MediaLibraryInput/index.js'
// import { CKEditorInput } from "@ckeditor/strapi-plugin-ckeditor/admin/src/components/CKEditorInput/index";

import useWindow from '../hooks/use-window';
import DialogConfirm from './DialogConfirm';
import Categories from './Categories';
import Marker from './Marker';
import { useField } from '@strapi/strapi/admin';
import { Field } from '@strapi/design-system';
import { InputWrapper, ResortMap } from './styled-components';
import { Dialog } from '@strapi/design-system';
import { getImgStub } from '../utils/getImgStub';
import { Textarea } from '@strapi/design-system';

const MarkersCustomFields = ({ name: entityName }) => {
  const { onChange: entityOnChange, value: entityValue } = useField(entityName)
  const defaultColor = '#000000';
  const [coordsObj, setCoordsObj] = useState({
    mapPreview: null,
    mapCategories: [
      {
        title: 'your category title',
        color: defaultColor,
        markers: [],
        pointer: {},
      },
    ],
  });
  const [changesDone, setChangesDone] = useState(false);

  const [mapState, setMapState] = useState(null);
  const [imgUrl, setImgUrl] = useState('');

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [editCategoryMode, setEditCategoryMode] = useState(false);

  const screenSize = useWindow();
  const imgRef = useRef(null);
  const [mapRect, setMapRect] = useState<HTMLImageElement | null>();

  const [markerTitle, setMarkerTitle] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkHref, setLinkHref] = useState('');
  const [titleValidationPassed, setTitleValidationPassed] = useState(false);
  const [contentImageState, setContentImageState] = useState(null);
  const [markerContent, setMarkerContent] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [markerPlacement, setMarkerPlacement] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const validateMarkerTitle = () => {
    if (markerTitle !== null && markerTitle !== undefined) {
      if (markerTitle.length > 0) {
        setTitleValidationPassed(true);
      } else {
        setTitleValidationPassed(false);
      }
    } else {
      setTitleValidationPassed(true);
    }
  };

  const findEditableMarker = () => {
    return coordsObj?.mapCategories[categoryIndex]?.markers?.find((marker) => {
      return marker.id === selectedMarker;
    });
  };

  const updateMarkerTitle = (markerTitle) => {
    setMarkerTitle(markerTitle);

    const editableMarker = findEditableMarker();

    if (editableMarker?.title !== markerTitle) {
      updateMarkerObject({ id: selectedMarker, newTitle: markerTitle } as any);
    }
  };

  const updateLinkLabel = (linkLabel) => {
    setLinkLabel(linkLabel);

    const editableMarker = findEditableMarker();

    if (editableMarker?.linkLabel !== linkLabel) {
      updateMarkerObject({ id: selectedMarker, newLinkLabel: linkLabel } as any);
    }
  };

  const updateLinkHref = (linkHref) => {
    setLinkHref(linkHref);

    const editableMarker = findEditableMarker();

    if (editableMarker?.linkHref !== linkHref) {
      updateMarkerObject({ id: selectedMarker, newLinkHref: linkHref } as any);
    }
  };

  const updateLinkTarget = (linkTarget) => {
    setLinkTarget(linkTarget);

    const editableMarker = findEditableMarker();

    if (editableMarker?.linkTarget !== linkTarget) {
      updateMarkerObject({
        id: selectedMarker,
        newLinkTarget: linkTarget,
      } as any);
    }
  };

  const updateMarkerPlacement = (markerPlacement) => {
    setMarkerPlacement(markerPlacement);

    const editableMarker = findEditableMarker();

    if (editableMarker?.placement !== markerPlacement) {
      updateMarkerObject({ id: selectedMarker, newPlacement: markerPlacement } as any);
    }
  };

  const updateMarkerContent = (markerContent) => {
    setMarkerContent(markerContent);

    const editableMarker = findEditableMarker();

    if (editableMarker?.content !== markerContent) {
      updateMarkerObject({ id: selectedMarker, newContent: markerContent } as any);
    }
  };

  const changeMap = (imgObj) => {
    setMapState(imgObj);
    setImgUrl(imgObj?.url);
    setTitleValidationPassed(true);

    let coordsObjNew = { ...coordsObj };

    coordsObjNew.mapPreview = imgObj;
    setCoordsObj(coordsObjNew);
    setChangesDone(true);
  };

  const changeContentImage = (imgObj) => {
    setContentImageState(imgObj);

    const editableMarker = findEditableMarker();

    if (editableMarker?.image?.url !== imgObj?.url) {
      updateMarkerObject({ id: selectedMarker, newImage: imgObj } as any);
    }
  };

  const mapProps = {
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: 'media',
      multiple: false,
      required: false,
      allowedTypes: ['images'],
    },
    description: null,
    hint: '',
    disabled: false,
    intlLabel: {
      id: 'mapImage',
      defaultMessage: 'Image',
    },
    error: null,
    name: 'mapImage',
    onChange: (e) => {
      changeMap(e.target.value);
    },
    required: false,
    placeholder: null,
    type: 'media',
    value: mapState || [],
  };

  const contentImageProps = {
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: 'media',
      multiple: false,
      required: false,
      allowedTypes: ['images'],
    },
    description: null,
    hint: '',
    disabled: false,
    intlLabel: {
      id: 'contentImage',
      defaultMessage: 'Image',
    },
    error: null,
    name: 'contentImage',
    onChange: (e) => {
      changeContentImage(e.target.value);
    },
    required: false,
    placeholder: null,
    type: 'media',
    value: contentImageState || [],
  };

  const inputProps = {
    name: 'markerTitle',
    id: 'markerTitle',
    label: 'Title',
    'aria-label': 'Marker Title',
    hint: '',
    placeholder: '',
    type: 'text',
    value: markerTitle,
    required: true,
    disabled: false,
    size: 'S',
    error: titleValidationPassed ? null : 'This field is required',
    onChange: (e) => updateMarkerTitle(e.target.value),
  };

  const labelProps = {
    name: 'linkLabel',
    id: 'linkLabel',
    label: 'Link Label',
    'aria-label': 'Link Label',
    hint: '',
    placeholder: '',
    type: 'text',
    value: linkLabel,
    required: false,
    disabled: false,
    size: 'S',
    error: null,
    onChange: (e) => updateLinkLabel(e.target.value),
  };

  const hrefProps = {
    name: 'linkHref',
    id: 'linkHref',
    label: 'Link Href',
    'aria-label': 'Link Label',
    hint: '',
    placeholder: '',
    type: 'text',
    value: linkHref,
    required: false,
    disabled: false,
    size: 'S',
    error: null,
    onChange: (e) => updateLinkHref(e.target.value),
  };

  const targetProps = {
    name: 'linkTarget',
    id: 'linkTarget',
    label: 'Link Target',
    'aria-label': 'Target',
    hint: '',
    placeholder: 'Choose Here',
    value: linkTarget,
    onValueChange: updateLinkTarget,
  };

  const selectProps = {
    name: 'MarkerPlacement',
    id: 'MarkerPlacement',
    label: 'Placement',
    'aria-label': 'Marker Placement',
    hint: '',
    placeholder: 'Select title placement',
    value: markerPlacement,
    onValueChange: updateMarkerPlacement,
  };

  const CKEditorProps = {
    name: 'markerContent',
    id: 'markerContent',
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: 'richtext',
      // options: { output: 'HTML', preset: 'standard' },
      // customField: 'plugin::ckeditor.CKEditor',
    },
    description: null,
    // disabled: false,
    disabled: true,
    intlLabel: {
      id: 'markerContent',
      defaultMessage: 'Content',
    },
    labelAction: null,
    error: null,
    required: false,
    // type: 'plugin::ckeditor.CKEditor',
    type: 'richtext',
    value: markerContent,
    onChange: (e) => updateMarkerContent(e.target.value),
  };

  const changeTab = (selectedTab) => {
    setCategoryIndex(selectedTab);
    selectMarker(coordsObj?.mapCategories[selectedTab]?.markers[0]?.id || 0);
  };

  const updateMarkerObject = ({
    id,
    newTitle,
    newPlacement,
    newLinkTarget,
    newContent,
    newImage,
    newLinkLabel,
    newLinkHref,
    newX,
    newY,
  }) => {
    if (coordsObj?.mapCategories && id) {
      const newCoords = coordsObj?.mapCategories[categoryIndex]?.markers?.map((marker) => {
        if (marker.id === id) {
          if (newTitle !== null && newTitle !== undefined) {
            marker.title = newTitle;
          }
          if (newPlacement !== null && newPlacement !== undefined) {
            marker.placement = newPlacement;
          }
          if (newLinkTarget !== null && newLinkTarget !== undefined) {
            marker.linkTarget = newLinkTarget;
          }
          if (newLinkLabel !== null && newLinkLabel !== undefined) {
            marker.linkLabel = newLinkLabel;
          }
          if (newLinkHref !== null && newLinkHref !== undefined) {
            marker.linkHref = newLinkHref;
          }
          if (newContent !== null && newContent !== undefined) {
            marker.content = newContent;
          }
          if (newImage !== null && newImage !== undefined) {
            marker.image = newImage;
          }
          if (newX && newY) {
            marker.xPoint = newX;
            marker.yPoint = newY;
          }
        }

        return marker;
      });
      let coordsObjNew = { ...coordsObj };

      coordsObjNew.mapCategories[categoryIndex].markers = newCoords;
      setCoordsObj(coordsObjNew);
      setChangesDone(true);
    }
  };

  const deleteMarker = () => {
    setShowDeleteDialog(true);
  };

  const cancelDeleteMarker = () => {
    setShowDeleteDialog(false);
  };

  const finishDeleteMarker = (i) => {
    if (coordsObj?.mapCategories) {
      const newCoords = coordsObj?.mapCategories[categoryIndex]?.markers?.filter(
        (marker) => marker.id !== selectedMarker
      );
      let coordsObjNew = { ...coordsObj };

      if (coordsObjNew.mapCategories) {
        coordsObjNew.mapCategories[categoryIndex].markers = newCoords;
        setCoordsObj(coordsObjNew);
        setChangesDone(true);
      }
      selectMarker(coordsObjNew?.mapCategories[categoryIndex]?.markers[0]?.id || 0);
    }
    setShowDeleteDialog(false);
  };

  const selectMarker = (id) => {
    if (id === 0) {
      setMarkerTitle('');
      setMarkerPlacement(null);
      setLinkTarget('');
      setMarkerContent('');
    }
    setSelectedMarker(id);
  };

  const addMarker = (e) => {
    e.preventDefault();
    setTitleValidationPassed(false);

    const imgLeft = imgRef.current?.getBoundingClientRect().left;
    const imgTop = imgRef.current?.getBoundingClientRect().top;
    let newLeft = 0;
    let newTop = 0;

    if (imgLeft && imgTop) {
      newLeft = ((e.clientX - imgLeft) / imgRef.current.getBoundingClientRect().width) * 100;
      newTop = ((e.clientY - imgTop) / imgRef.current.getBoundingClientRect().height) * 100;
    }

    const newMarker = {
      id: Date.now(),
      xPoint: newLeft,
      yPoint: newTop,
      title: '',
      content: '',
    };
    let coordsObjNew = { ...coordsObj };

    coordsObjNew.mapCategories[categoryIndex].markers?.push(newMarker);

    setCoordsObj(coordsObjNew);
    setChangesDone(true);
    selectMarker(newMarker.id);
  };

  const updateCategories = (categories) => {
    let coordsObjNew = { ...coordsObj };

    coordsObjNew.mapCategories = categories;
    setCoordsObj(coordsObjNew);
    setChangesDone(true);
  };

  // Get data from Strapi
  useEffect(() => {
    // Entry point
    try {
      // Parse Strapi data
      const parsedObj = entityValue;

      setCoordsObj(parsedObj);
      setMapState(parsedObj?.mapPreview);
      setImgUrl(parsedObj?.mapPreview?.url || '');
      selectMarker(parsedObj?.mapCategories[categoryIndex]?.markers[0]?.id);
      setChangesDone(false);
    } catch (error) {
      console.log('There are some problems with parsing object', error);
      // We can not parse json if Entry is new, json is not exist
      // So in this case we will use fallback - default object structure
      // and initiate saving to Strapi
      setTimeout(() => {
        setCoordsObj(coordsObj);
        setChangesDone(true);
        setTitleValidationPassed(true);
      }, 200);
    }
  }, []);

  // Write data to Strapi
  useEffect(() => {
    if (changesDone && titleValidationPassed) {
      const coordsValue = JSON.stringify(coordsObj);

      // Write changes to Strapi, it will call highlighting of Save button
      entityOnChange({
        target: { name: entityName, value: coordsValue, type: 'text' },
      } as any);
      // After pressing Save button changes will be written to Strapi DB
    }
  }, [coordsObj, changesDone, titleValidationPassed]);

  // Setup proper values for marker's fields
  useEffect(() => {
    coordsObj?.mapCategories[categoryIndex]?.markers?.map((marker) => {
      if (marker.id === selectedMarker) {
        setTimeout(() => {
          setMarkerTitle(marker.title || '');
          setMarkerPlacement(marker.placement || null);
          setLinkTarget(marker.linkTarget || '');
          setLinkHref(marker.linkHref || '');
          setLinkLabel(marker.linkLabel || '');
          setMarkerContent(marker.content || '');
          setContentImageState(marker.image || null);
        }, 100);
      }
    });
  }, [selectedMarker]);

  // Validate Marker Title
  useEffect(() => {
    validateMarkerTitle();
  }, [markerTitle]);

  // Define map properties
  useEffect(() => {
    if (imgRef.current?.clientWidth) {
      setMapRect(imgRef.current.getBoundingClientRect());
    }

    const interval = setInterval(() => {
      if (!(mapRect?.width && mapRect?.height)) {
        if (imgRef.current?.clientWidth) {
          setMapRect(imgRef.current.getBoundingClientRect());
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    imgRef.current?.clientWidth,
    imgRef.current?.clientHeight,
    screenSize.width,
    screenSize.height,
  ]);


  console.log((window as any).CKEDITOR)
  return (
    <>
      <Box spacing={1} className="plugin-custom-fields">
        {/* TEMP FIX UNTIL NEW MEDIA INPUT IS CREATED */}
        {/* <MediaLibraryInput {...mapProps}></MediaLibraryInput> */}
        <Field.Root required>
          <Field.Label>Image URL</Field.Label>
          <TextInput
            {...mapProps}
            value={mapProps.value.url}
            onChange={e => {
              mapProps.onChange(getImgStub(e))
            }} />
          <Field.Error />
        </Field.Root>

        <Box paddingTop={4}>
          <Toggle
            onLabel="Settings"
            offLabel="Preview"
            checked={editCategoryMode}
            onChange={(e) => setEditCategoryMode(e.target.checked)}
          />
        </Box>
        {!editCategoryMode && (
          <Tabs.Root
            label="Marker Categories"
            variant="simple"
            onValueChange={changeTab}
            defaultValue={categoryIndex}
          >
            <Tabs.List style={{
              flexWrap: 'wrap'
            }}>
              {coordsObj?.mapCategories?.map((el, i) => (
                <Tabs.Trigger key={i} value={i}>{el.title}</Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        )}
        {editCategoryMode && (
          <Box paddingTop={4}>
            <Categories
              categories={coordsObj?.mapCategories}
              updateCategories={updateCategories}
            />
          </Box>
        )}
        <ResortMap className="resort-map">
          {!editCategoryMode && imgUrl && (
            <img src={`${imgUrl}`} ref={imgRef} onClick={addMarker} style={{ maxWidth: '100%' }} />
          )}
          {!editCategoryMode && imgUrl && (
            <ul>
              {mapRect &&
                coordsObj?.mapCategories[categoryIndex] &&
                coordsObj?.mapCategories[categoryIndex]?.markers?.map((el, i) => (
                  <li key={i}>
                    <Marker
                      coords={el}
                      markerColor={
                        (coordsObj?.mapCategories[categoryIndex] &&
                          coordsObj?.mapCategories[categoryIndex]?.color) ||
                        defaultColor
                      }
                      markerPointer={
                        (coordsObj?.mapCategories[categoryIndex] &&
                          coordsObj?.mapCategories[categoryIndex]?.pointer) ||
                        {}
                      }
                      mapRect={mapRect}
                      updateMarker={updateMarkerObject}
                      isSelected={el.id === selectedMarker}
                      selectMarker={selectMarker}
                    />
                  </li>
                ))}
            </ul>
          )}
        </ResortMap>
        {!editCategoryMode && coordsObj?.mapCategories[categoryIndex]?.markers?.length > 0 && (
          <>
            <Box padding={4} background="neutral100" className="marker-editor-wrapper">
              <Field.Root required>
                <Field.Label>{inputProps.label}</Field.Label>
                <TextInput {...inputProps} />
                <Field.Error />
              </Field.Root>
              <br />

              {/* TEMP FIX UNTIL NEW MEDIA INPUT IS CREATED */}
              {/* <MediaLibraryInput {...contentImageProps}></MediaLibraryInput> */}
              <Field.Root>
                <Field.Label>Image URL</Field.Label>
                <TextInput
                  {...contentImageProps}
                  placeholder="Optional"
                  value={contentImageProps.value.url}
                  onChange={e => {
                    contentImageProps.onChange(getImgStub(e))
                  }} />
                <Field.Error />
              </Field.Root>

              <br />

              {/* TEMP FIX UNTIL NEW MEDIA INPUT IS CREATED */}
              {/* <CKEditorInput {...CKEditorProps}></CKEditorInput> */}
              <Field.Root>
                <Field.Label>Content (Deprecated)</Field.Label>
                <Textarea
                  {...CKEditorProps}
                  placeholder="Optional"
                />
                <Field.Error />
              </Field.Root>

              <br />

              <Grid.Root
                gap={{
                  large: 5,
                  medium: 2,
                  initial: 1,
                }}
              >
                <InputWrapper background="neutral100" col={6} s={12}>
                  <Field.Root>
                    <Field.Label>{labelProps.label}</Field.Label>
                    <TextInput {...labelProps} placeholder="Optional" />
                    <Field.Error />
                  </Field.Root>
                </InputWrapper>
                <InputWrapper background="neutral100" col={6} s={12}>
                  <Field.Root>
                    <Field.Label>{hrefProps.label}</Field.Label>
                    <TextInput {...hrefProps} placeholder="Optional" />
                    <Field.Error />
                  </Field.Root>
                </InputWrapper>
                <InputWrapper background="neutral100" col={6} s={12}>
                  <Field.Root>
                    <Field.Label>{targetProps.label}</Field.Label>
                    <SingleSelect {...targetProps}>
                      <SingleSelectOption value="_self">_self</SingleSelectOption>
                      <SingleSelectOption value="_blank">_blank</SingleSelectOption>
                    </SingleSelect>
                    <Field.Error />
                  </Field.Root>
                </InputWrapper>
              </Grid.Root>
              <br />

              <Grid.Root
                gap={{
                  large: 5,
                  medium: 2,
                  initial: 1,
                }}
              >
                <InputWrapper background="neutral100" col={6} s={12}>
                  <Field.Root>
                    <Field.Label>{selectProps.label}</Field.Label>
                    <SingleSelect {...selectProps}>
                      <SingleSelectOption value="top">top</SingleSelectOption>
                      <SingleSelectOption value="left">left</SingleSelectOption>
                      <SingleSelectOption value="bottom">bottom</SingleSelectOption>
                      <SingleSelectOption value="right">right</SingleSelectOption>
                    </SingleSelect>
                    <Field.Error />
                  </Field.Root>
                </InputWrapper>
                <br />
              </Grid.Root>
            </Box>

            <Grid.Root>
              <Grid.Item padding={4} background="neutral100" col={12} justifyContent="end" alignItems="end">
                <Flex style={{ height: '100%' }}>
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button variant="danger" onClick={deleteMarker}>
                        Delete
                      </Button>
                    </Dialog.Trigger>

                    {showDeleteDialog && (
                      <DialogConfirm
                        type="marker"
                        index={selectedMarker}
                        title={markerTitle}
                        cancel={cancelDeleteMarker}
                        delete={finishDeleteMarker}
                      />
                    )}
                  </Dialog.Root>
                </Flex>
              </Grid.Item >
            </Grid.Root>
          </>
        )}
      </Box>
    </>

  );
};

export default MarkersCustomFields;
