import { useRef, useEffect, useState } from "react";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Dialog, Typography, Button, Grid, Box, Table, Thead, Tr, Th, Tbody, Td, Flex, IconButton, TextInput, Link, Field, Toggle, Tabs, Textarea, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { WarningCircle, Trash, ArrowUp, ArrowDown, Pencil, Check, Cross } from "@strapi/icons";
import styled from "styled-components";
import { useField } from "@strapi/strapi/admin";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "markers";
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function useWindow() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0
  });
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    if (!windowDimensions.width) {
      handleResize();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}
const DialogConfirm = (props) => {
  const markerConfirmation = /* @__PURE__ */ jsxs("span", { children: [
    'Are you sure you want to delete "',
    props.title,
    '" marker?'
  ] });
  const categoryConfirmation1 = /* @__PURE__ */ jsxs("span", { children: [
    'Are you sure you want to delete "',
    props.title,
    '" category?',
    /* @__PURE__ */ jsx("br", {}),
    /* @__PURE__ */ jsx("br", {})
  ] });
  let categoryConfirmation2;
  switch (props.count) {
    case 0:
      categoryConfirmation2 = /* @__PURE__ */ jsx("span", { children: "This category doesn't have any marker." });
      break;
    case 1:
      categoryConfirmation2 = /* @__PURE__ */ jsxs("span", { children: [
        "This category has 1 marker on the map.",
        /* @__PURE__ */ jsx("br", {}),
        "It will be deleted."
      ] });
      break;
    default:
      categoryConfirmation2 = /* @__PURE__ */ jsxs("span", { children: [
        "This category has ",
        props.count,
        " markers on the map.",
        /* @__PURE__ */ jsx("br", {}),
        "They all will be deleted."
      ] });
  }
  const categoryConfirmation = /* @__PURE__ */ jsxs("span", { children: [
    categoryConfirmation1,
    " ",
    categoryConfirmation2
  ] });
  props.type === "marker" ? markerConfirmation : categoryConfirmation;
  return /* @__PURE__ */ jsxs(Dialog.Content, { onClose: () => props.cancel(), title: "Confirmation", isOpen: props.index > -1 ? true : false, children: [
    /* @__PURE__ */ jsx(Dialog.Header, { children: "Confirmation" }),
    /* @__PURE__ */ jsxs(Dialog.Body, { children: [
      /* @__PURE__ */ jsx(WarningCircle, { fill: "danger600", width: 25, height: 25 }),
      /* @__PURE__ */ jsx(Typography, { textAlign: "center", children: props.type === "marker" ? markerConfirmation : categoryConfirmation })
    ] }),
    /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
      /* @__PURE__ */ jsx(Dialog.Cancel, { children: /* @__PURE__ */ jsx(Button, { onClick: () => props.cancel(), variant: "tertiary", children: "Cancel" }) }),
      /* @__PURE__ */ jsx(Dialog.Action, { children: /* @__PURE__ */ jsx(Button, { onClick: () => props.delete(props.index), variant: "danger-light", startIcon: /* @__PURE__ */ jsx(Trash, {}), children: "Yes, Delete" }) })
    ] })
  ] });
};
const InputWrapper = styled(Grid.Item)`
  > div {
    width: 100%;
  }
`;
styled(Box)`
  max-width: 30px;
  max-height: 30px;
`;
const CategoryPointer = styled(Box)`
  font-size: 0 !important;
  height: auto !important;

  * {
    font-size: 0 !important;
    height: auto !important;
  }

  svg {
    margin-bottom: 0 !important;
  }

  img, svg {
    max-width: 80px !important;
    max-height: 80px !important;
  }
  
  section + * {
    display: none !important;
  }

  section > div:last-child {
    bottom: 0 !important;
  }
`;
const ResortMap = styled(Box)`
  position: relative;
`;
const MapMarkerWrapper = styled.div`
  position: absolute;
  min-height: 12px;
  min-width: 12px;
`;
const MapMarkerDot = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 12px;
  height: 12px;
  border: 1px solid #000;
  border-radius: 100%;
  background-color: #000;
  background-clip: padding-box;
  cursor: pointer;
  box-shadow:
    1px 1px #fff,
    -1px 1px #fff,
    1px -1px #fff,
    -1px -1px #fff;

  ${({ selected }) => selected && `
    outline: 2px dashed #ff0;
  `}
`;
const MapMarkerPointer = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  max-height: 30px;
  max-width: 30px;
  height: 20px;
  width: auto;
  cursor: pointer;

  ${({ selected }) => selected && `
    outline: 2px dashed #ff0;
  `}
`;
const Categories = (props) => {
  const defaultColor = "#000000";
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [addCategoryTitle, setAddCategoryTitle] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [editCategoryTitle, setEditCategoryTitle] = useState(
    editIndex > -1 ? props.categories[editIndex].title : ""
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const COL_COUNT = 5;
  const ROW_COUNT = props.categories.length + 2;
  const [imagePropsState, setImagePropsState] = useState(null);
  ({
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"]
    },
    description: null,
    hint: "",
    disabled: false,
    intlLabel: {
      id: "pointer",
      defaultMessage: "image"
    },
    error: null,
    onChange: (event) => {
      changeImage(event);
    },
    required: false,
    placeholder: null,
    type: "media",
    value: imagePropsState?.value || []
  });
  const changeImage = (event) => {
    const imageIndex = event.target.name.split("-")[1];
    const categoriesNew = [...props.categories];
    categoriesNew[imageIndex].pointer = event.target;
    if (!categoriesNew[imageIndex].pointer.value) {
      categoriesNew[imageIndex].pointer.value = [];
    }
    props.updateCategories(categoriesNew);
  };
  const addCategory = () => {
    setIsAddCategory(true);
  };
  const saveAddCategory = () => {
    const formatTitle = addCategoryTitle.trim();
    if (formatTitle !== "") {
      const categoriesNew = [...props.categories];
      categoriesNew.push({
        title: formatTitle,
        color: defaultColor,
        markers: [],
        pointer: {}
      });
      props.updateCategories(categoriesNew);
      setIsAddCategory(false);
      setAddCategoryTitle("");
    }
  };
  const cancelAddCategory = () => {
    setIsAddCategory(false);
    setAddCategoryTitle("");
  };
  const editCategory = (i) => {
    if (i === editIndex) {
      setEditIndex(-1);
      setEditCategoryTitle("");
    } else {
      setEditIndex(i);
      setEditCategoryTitle(props.categories[i].title);
    }
  };
  const saveEditCategory = () => {
    const formatTitle = editCategoryTitle.trim();
    if (formatTitle !== "") {
      const categoriesNew = [...props.categories];
      categoriesNew[editIndex].title = formatTitle;
      props.updateCategories(categoriesNew);
      setEditIndex(-1);
      setEditCategoryTitle("");
    }
  };
  const cancelEditCategory = () => {
    setEditIndex(-1);
    setEditCategoryTitle("");
  };
  const deleteCategory = (i) => {
    setDeleteIndex(i);
    setShowDeleteDialog(true);
  };
  const cancelDeleteCategory = () => {
    setDeleteIndex(-1);
    setShowDeleteDialog(false);
  };
  const finishDeleteCategory = (i) => {
    const categoriesNew = [...props.categories];
    categoriesNew.splice(i, 1);
    props.updateCategories(categoriesNew);
    setDeleteIndex(-1);
    setShowDeleteDialog(false);
  };
  const moveUp = (i) => {
    if (i > 0) {
      const categoriesNew = [...props.categories];
      categoriesNew.splice(i - 1, 0, categoriesNew.splice(i, 1)[0]);
      props.updateCategories(categoriesNew);
    }
  };
  const moveDown = (i) => {
    if (i < props.categories.length - 1) {
      const categoriesNew = [...props.categories];
      categoriesNew.splice(i + 1, 0, categoriesNew.splice(i, 1)[0]);
      props.updateCategories(categoriesNew);
    }
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Table, { colCount: COL_COUNT, rowCount: ROW_COUNT, children: [
    /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: "Order" }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: "Title" }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: "Edit" }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: "Pointer" }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: "Delete" }) })
    ] }) }),
    /* @__PURE__ */ jsxs(Tbody, { children: [
      props.categories.map((category, i) => /* @__PURE__ */ jsxs(Tr, { children: [
        editIndex !== i && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, { children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              variant: "ghost",
              withTooltip: false,
              onClick: () => {
                moveUp(i);
              },
              children: /* @__PURE__ */ jsx(ArrowUp, {})
            }
          ),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              variant: "ghost",
              withTooltip: false,
              onClick: () => {
                moveDown(i);
              },
              children: /* @__PURE__ */ jsx(ArrowDown, {})
            }
          )
        ] }) }),
        editIndex !== i && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: category.title }) }),
        editIndex !== i && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(
          IconButton,
          {
            label: "Edit",
            variant: "ghost",
            withTooltip: false,
            onClick: () => {
              editCategory(i);
            },
            children: /* @__PURE__ */ jsx(Pencil, {})
          }
        ) }),
        editIndex !== i && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(CategoryPointer, { children: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("img", { src: category?.pointer?.value?.url, width: 20, height: 20 }) }) }) }),
        editIndex !== i && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Dialog.Root, { children: [
          /* @__PURE__ */ jsx(Dialog.Trigger, { children: /* @__PURE__ */ jsx(
            IconButton,
            {
              label: "Delete",
              variant: "ghost",
              withTooltip: false,
              onClick: () => {
                deleteCategory(i);
              },
              children: /* @__PURE__ */ jsx(Trash, {})
            }
          ) }),
          showDeleteDialog && /* @__PURE__ */ jsx(
            DialogConfirm,
            {
              type: "category",
              index: deleteIndex,
              title: props.categories[deleteIndex]?.title,
              count: props.categories[deleteIndex]?.markers?.length || 0,
              cancel: cancelDeleteCategory,
              delete: finishDeleteCategory
            }
          )
        ] }) }),
        editIndex === i && /* @__PURE__ */ jsx(Td, { colSpan: COL_COUNT - 3, children: /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingBottom: 6, children: /* @__PURE__ */ jsx(
          TextInput,
          {
            value: editCategoryTitle,
            name: "categoryTitle",
            "aria-label": "title of category",
            size: "S",
            onChange: (e) => setEditCategoryTitle(e.target.value)
          }
        ) }) }),
        editIndex === i && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, { children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              label: "Save",
              variant: "ghost",
              withTooltip: false,
              onClick: saveEditCategory,
              children: /* @__PURE__ */ jsx(Check, {})
            }
          ),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              label: "Cancel",
              variant: "ghost",
              withTooltip: false,
              onClick: cancelEditCategory,
              children: /* @__PURE__ */ jsx(Cross, {})
            }
          )
        ] }) })
      ] }, i)),
      /* @__PURE__ */ jsxs(Tr, { children: [
        /* @__PURE__ */ jsx(Td, { colSpan: COL_COUNT - 3, children: /* @__PURE__ */ jsxs(Flex, { children: [
          !isAddCategory && /* @__PURE__ */ jsx(Link, { onClick: addCategory, children: "Add new category" }),
          isAddCategory && /* @__PURE__ */ jsx(
            TextInput,
            {
              value: addCategoryTitle,
              name: "categoryTitle",
              "aria-label": "title of category",
              size: "S",
              onChange: (e) => setAddCategoryTitle(e.target.value)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: isAddCategory && /* @__PURE__ */ jsxs(Flex, { children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              label: "Save",
              variant: "ghost",
              withTooltip: false,
              onClick: saveAddCategory,
              children: /* @__PURE__ */ jsx(Check, {})
            }
          ),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              label: "Cancel",
              variant: "ghost",
              withTooltip: false,
              onClick: cancelAddCategory,
              children: /* @__PURE__ */ jsx(Cross, {})
            }
          )
        ] }) }) })
      ] })
    ] })
  ] }) });
};
const Marker = (props) => {
  const markerRadius = 6;
  let markerLeftRadius = markerRadius;
  let markerTopRadius = markerRadius;
  if (props.markerPointer?.value?.width && props.markerPointer?.value?.height) {
    const koef = props.markerPointer.value.height / props.markerPointer.value.width;
    markerTopRadius = 10;
    markerLeftRadius = markerTopRadius / koef;
  }
  const markerShiftX = markerLeftRadius / props.mapRect.width * 100;
  const markerShiftY = markerTopRadius / props.mapRect.height * 100;
  const [posX, setPosX] = useState(String(props.coords.xPoint - markerShiftX) + "%");
  const [posY, setPosY] = useState(String(props.coords.yPoint - markerShiftY) + "%");
  const [isMarkerSelected, setIsMarkerSelected] = useState(props.isSelected);
  const screenSize = useWindow();
  const markerRef = useRef(null);
  const selectMarker = () => {
    setIsMarkerSelected(true);
    props.selectMarker(props.coords.id || 0);
  };
  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.onmousedown = function(e) {
        e.preventDefault();
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        function onMouseMove(e2) {
          const scrollTop = window.scrollY;
          let newLeft = e2.clientX - props.mapRect.left - markerLeftRadius;
          const offsetTop = document.getElementsByClassName("resort-map")[0].offsetTop;
          let newTop = e2.clientY - offsetTop - markerTopRadius + scrollTop;
          if (newLeft < 0) {
            newLeft = 0;
          }
          console.log(newTop, "TOP");
          if (newTop < 0) {
            newTop = 0;
          }
          let rightEdge = 0;
          let bottomEdge = 0;
          if (marker) {
            rightEdge = props.mapRect.width - marker.offsetWidth;
            bottomEdge = props.mapRect.height - marker.offsetHeight;
          }
          if (newLeft > rightEdge) {
            newLeft = rightEdge;
          }
          if (newTop > bottomEdge) {
            newTop = bottomEdge;
          }
          let newLeftConverted = newLeft / props.mapRect.width * 100;
          let newTopConverted = newTop / props.mapRect.height * 100;
          if (marker) {
            marker.style.left = newLeftConverted + "%";
            marker.style.top = newTopConverted + "%";
          }
          props.updateMarker({
            id: props.coords.id,
            newX: newLeftConverted + markerShiftX,
            newY: newTopConverted + markerShiftY
          });
        }
        function onMouseUp() {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousemove", onMouseMove);
        }
      };
      marker.ondragstart = function() {
        return false;
      };
    }
  }, [props.coords.id, props.mapRect.width, props.mapRect.height, screenSize.width, screenSize.height]);
  useEffect(() => {
    setPosX(String(props.coords.xPoint - markerShiftX) + "%");
    setPosY(String(props.coords.yPoint - markerShiftY) + "%");
  }, [props.coords.xPoint, props.coords.yPoint]);
  useEffect(() => {
    setIsMarkerSelected(props.isSelected);
  }, [props.isSelected]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    MapMarkerWrapper,
    {
      ref: markerRef,
      onMouseDown: selectMarker,
      style: {
        left: posX,
        top: posY
      },
      children: [
        !props.markerPointer?.value?.url && /* @__PURE__ */ jsx(
          MapMarkerDot,
          {
            selected: isMarkerSelected,
            style: { backgroundColor: props.markerColor }
          }
        ),
        props.markerPointer?.value?.url && /* @__PURE__ */ jsx(
          MapMarkerPointer,
          {
            selected: isMarkerSelected,
            src: props.markerPointer?.value?.url,
            alt: props.coords.title
          }
        )
      ]
    }
  ) });
};
const getImgStub = (e) => {
  const realUrl = e.target.value;
  const imgStub = {
    "id": 0,
    "ext": ".jpg",
    "url": realUrl,
    "hash": "",
    "mime": "image/jpeg",
    "name": "",
    "size": 0,
    "type": "asset",
    "width": 0,
    "folder": {
      "id": 0,
      "name": "",
      "path": "",
      "pathId": 0,
      "createdAt": "",
      "updatedAt": ""
    },
    "height": 0,
    "caption": null,
    "formats": {
      "thumbnail": {
        "ext": ".jpg",
        "url": "",
        "hash": "",
        "mime": "image/jpeg",
        "name": "",
        "path": null,
        "size": 0,
        "width": 0,
        "height": 0,
        "public_id": ""
      }
    },
    "provider": "strapi-provider-upload-sftp-v3",
    "createdAt": "",
    "updatedAt": "",
    "folderPath": "",
    "previewUrl": null,
    "isSelectable": true,
    "alternativeText": null,
    "provider_metadata": null
  };
  return {
    ...e,
    target: { value: imgStub }
  };
};
const MarkersCustomFields = ({ name: entityName }) => {
  const { onChange: entityOnChange, value: entityValue } = useField(entityName);
  const defaultColor = "#000000";
  const [coordsObj, setCoordsObj] = useState({
    mapPreview: null,
    mapCategories: [
      {
        title: "your category title",
        color: defaultColor,
        markers: [],
        pointer: {}
      }
    ]
  });
  const [changesDone, setChangesDone] = useState(false);
  const [mapState, setMapState] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [editCategoryMode, setEditCategoryMode] = useState(false);
  const screenSize = useWindow();
  const imgRef = useRef(null);
  const [mapRect, setMapRect] = useState();
  const [markerTitle, setMarkerTitle] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [titleValidationPassed, setTitleValidationPassed] = useState(false);
  const [contentImageState, setContentImageState] = useState(null);
  const [markerContent, setMarkerContent] = useState("");
  const [linkTarget, setLinkTarget] = useState("");
  const [markerPlacement, setMarkerPlacement] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const validateMarkerTitle = () => {
    if (markerTitle !== null && markerTitle !== void 0) {
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
  const updateMarkerTitle = (markerTitle2) => {
    setMarkerTitle(markerTitle2);
    const editableMarker = findEditableMarker();
    if (editableMarker?.title !== markerTitle2) {
      updateMarkerObject({ id: selectedMarker, newTitle: markerTitle2 });
    }
  };
  const updateLinkLabel = (linkLabel2) => {
    setLinkLabel(linkLabel2);
    const editableMarker = findEditableMarker();
    if (editableMarker?.linkLabel !== linkLabel2) {
      updateMarkerObject({ id: selectedMarker, newLinkLabel: linkLabel2 });
    }
  };
  const updateLinkHref = (linkHref2) => {
    setLinkHref(linkHref2);
    const editableMarker = findEditableMarker();
    if (editableMarker?.linkHref !== linkHref2) {
      updateMarkerObject({ id: selectedMarker, newLinkHref: linkHref2 });
    }
  };
  const updateLinkTarget = (linkTarget2) => {
    setLinkTarget(linkTarget2);
    const editableMarker = findEditableMarker();
    if (editableMarker?.linkTarget !== linkTarget2) {
      updateMarkerObject({
        id: selectedMarker,
        newLinkTarget: linkTarget2
      });
    }
  };
  const updateMarkerPlacement = (markerPlacement2) => {
    setMarkerPlacement(markerPlacement2);
    const editableMarker = findEditableMarker();
    if (editableMarker?.placement !== markerPlacement2) {
      updateMarkerObject({ id: selectedMarker, newPlacement: markerPlacement2 });
    }
  };
  const updateMarkerContent = (markerContent2) => {
    setMarkerContent(markerContent2);
    const editableMarker = findEditableMarker();
    if (editableMarker?.content !== markerContent2) {
      updateMarkerObject({ id: selectedMarker, newContent: markerContent2 });
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
      updateMarkerObject({ id: selectedMarker, newImage: imgObj });
    }
  };
  const mapProps = {
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"]
    },
    description: null,
    hint: "",
    disabled: false,
    intlLabel: {
      id: "mapImage",
      defaultMessage: "Image"
    },
    error: null,
    name: "mapImage",
    onChange: (e) => {
      changeMap(e.target.value);
    },
    required: false,
    placeholder: null,
    type: "media",
    value: mapState || []
  };
  const contentImageProps = {
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"]
    },
    description: null,
    hint: "",
    disabled: false,
    intlLabel: {
      id: "contentImage",
      defaultMessage: "Image"
    },
    error: null,
    name: "contentImage",
    onChange: (e) => {
      changeContentImage(e.target.value);
    },
    required: false,
    placeholder: null,
    type: "media",
    value: contentImageState || []
  };
  const inputProps = {
    name: "markerTitle",
    id: "markerTitle",
    label: "Title",
    "aria-label": "Marker Title",
    hint: "",
    placeholder: "",
    type: "text",
    value: markerTitle,
    required: true,
    disabled: false,
    size: "S",
    error: titleValidationPassed ? null : "This field is required",
    onChange: (e) => updateMarkerTitle(e.target.value)
  };
  const labelProps = {
    name: "linkLabel",
    id: "linkLabel",
    label: "Link Label",
    "aria-label": "Link Label",
    hint: "",
    placeholder: "",
    type: "text",
    value: linkLabel,
    required: false,
    disabled: false,
    size: "S",
    error: null,
    onChange: (e) => updateLinkLabel(e.target.value)
  };
  const hrefProps = {
    name: "linkHref",
    id: "linkHref",
    label: "Link Href",
    "aria-label": "Link Label",
    hint: "",
    placeholder: "",
    type: "text",
    value: linkHref,
    required: false,
    disabled: false,
    size: "S",
    error: null,
    onChange: (e) => updateLinkHref(e.target.value)
  };
  const targetProps = {
    name: "linkTarget",
    id: "linkTarget",
    label: "Link Target",
    "aria-label": "Target",
    hint: "",
    placeholder: "Choose Here",
    value: linkTarget,
    onValueChange: updateLinkTarget
  };
  const selectProps = {
    name: "MarkerPlacement",
    id: "MarkerPlacement",
    label: "Placement",
    "aria-label": "Marker Placement",
    hint: "",
    placeholder: "Select title placement",
    value: markerPlacement,
    onValueChange: updateMarkerPlacement
  };
  const CKEditorProps = {
    name: "markerContent",
    id: "markerContent",
    multiple: false,
    withDefaultValue: false,
    attribute: {
      type: "richtext"
      // options: { output: 'HTML', preset: 'standard' },
      // customField: 'plugin::ckeditor.CKEditor',
    },
    description: null,
    // disabled: false,
    disabled: true,
    intlLabel: {
      id: "markerContent",
      defaultMessage: "Content"
    },
    labelAction: null,
    error: null,
    required: false,
    // type: 'plugin::ckeditor.CKEditor',
    type: "richtext",
    value: markerContent,
    onChange: (e) => updateMarkerContent(e.target.value)
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
    newY
  }) => {
    if (coordsObj?.mapCategories && id) {
      const newCoords = coordsObj?.mapCategories[categoryIndex]?.markers?.map((marker) => {
        if (marker.id === id) {
          if (newTitle !== null && newTitle !== void 0) {
            marker.title = newTitle;
          }
          if (newPlacement !== null && newPlacement !== void 0) {
            marker.placement = newPlacement;
          }
          if (newLinkTarget !== null && newLinkTarget !== void 0) {
            marker.linkTarget = newLinkTarget;
          }
          if (newLinkLabel !== null && newLinkLabel !== void 0) {
            marker.linkLabel = newLinkLabel;
          }
          if (newLinkHref !== null && newLinkHref !== void 0) {
            marker.linkHref = newLinkHref;
          }
          if (newContent !== null && newContent !== void 0) {
            marker.content = newContent;
          }
          if (newImage !== null && newImage !== void 0) {
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
      setMarkerTitle("");
      setMarkerPlacement(null);
      setLinkTarget("");
      setMarkerContent("");
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
      newLeft = (e.clientX - imgLeft) / imgRef.current.getBoundingClientRect().width * 100;
      newTop = (e.clientY - imgTop) / imgRef.current.getBoundingClientRect().height * 100;
    }
    const newMarker = {
      id: Date.now(),
      xPoint: newLeft,
      yPoint: newTop,
      title: "",
      content: ""
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
  useEffect(() => {
    try {
      const parsedObj = entityValue;
      setCoordsObj(parsedObj);
      setMapState(parsedObj?.mapPreview);
      setImgUrl(parsedObj?.mapPreview?.url || "");
      selectMarker(parsedObj?.mapCategories[categoryIndex]?.markers[0]?.id);
      setChangesDone(false);
    } catch (error) {
      console.log("There are some problems with parsing object", error);
      setTimeout(() => {
        setCoordsObj(coordsObj);
        setChangesDone(true);
        setTitleValidationPassed(true);
      }, 200);
    }
  }, []);
  useEffect(() => {
    if (changesDone && titleValidationPassed) {
      const coordsValue = JSON.stringify(coordsObj);
      entityOnChange({
        target: { name: entityName, value: coordsValue, type: "text" }
      });
    }
  }, [coordsObj, changesDone, titleValidationPassed]);
  useEffect(() => {
    coordsObj?.mapCategories[categoryIndex]?.markers?.map((marker) => {
      if (marker.id === selectedMarker) {
        setTimeout(() => {
          setMarkerTitle(marker.title || "");
          setMarkerPlacement(marker.placement || null);
          setLinkTarget(marker.linkTarget || "");
          setLinkHref(marker.linkHref || "");
          setLinkLabel(marker.linkLabel || "");
          setMarkerContent(marker.content || "");
          setContentImageState(marker.image || null);
        }, 100);
      }
    });
  }, [selectedMarker]);
  useEffect(() => {
    validateMarkerTitle();
  }, [markerTitle]);
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
    screenSize.height
  ]);
  console.log(window.CKEDITOR);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Box, { spacing: 1, className: "plugin-custom-fields", children: [
    /* @__PURE__ */ jsxs(Field.Root, { required: true, children: [
      /* @__PURE__ */ jsx(Field.Label, { children: "Image URL" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          ...mapProps,
          value: mapProps.value.url,
          onChange: (e) => {
            mapProps.onChange(getImgStub(e));
          }
        }
      ),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] }),
    /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(
      Toggle,
      {
        onLabel: "Settings",
        offLabel: "Preview",
        checked: editCategoryMode,
        onChange: (e) => setEditCategoryMode(e.target.checked)
      }
    ) }),
    !editCategoryMode && /* @__PURE__ */ jsx(
      Tabs.Root,
      {
        label: "Marker Categories",
        variant: "simple",
        onValueChange: changeTab,
        defaultValue: categoryIndex,
        children: /* @__PURE__ */ jsx(Tabs.List, { style: {
          flexWrap: "wrap"
        }, children: coordsObj?.mapCategories?.map((el, i) => /* @__PURE__ */ jsx(Tabs.Trigger, { value: i, children: el.title }, i)) })
      }
    ),
    editCategoryMode && /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(
      Categories,
      {
        categories: coordsObj?.mapCategories,
        updateCategories
      }
    ) }),
    /* @__PURE__ */ jsxs(ResortMap, { className: "resort-map", children: [
      !editCategoryMode && imgUrl && /* @__PURE__ */ jsx("img", { src: `${imgUrl}`, ref: imgRef, onClick: addMarker, style: { maxWidth: "100%" } }),
      !editCategoryMode && imgUrl && /* @__PURE__ */ jsx("ul", { children: mapRect && coordsObj?.mapCategories[categoryIndex] && coordsObj?.mapCategories[categoryIndex]?.markers?.map((el, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Marker,
        {
          coords: el,
          markerColor: coordsObj?.mapCategories[categoryIndex] && coordsObj?.mapCategories[categoryIndex]?.color || defaultColor,
          markerPointer: coordsObj?.mapCategories[categoryIndex] && coordsObj?.mapCategories[categoryIndex]?.pointer || {},
          mapRect,
          updateMarker: updateMarkerObject,
          isSelected: el.id === selectedMarker,
          selectMarker
        }
      ) }, i)) })
    ] }),
    !editCategoryMode && coordsObj?.mapCategories[categoryIndex]?.markers?.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Box, { padding: 4, background: "neutral100", className: "marker-editor-wrapper", children: [
        /* @__PURE__ */ jsxs(Field.Root, { required: true, children: [
          /* @__PURE__ */ jsx(Field.Label, { children: inputProps.label }),
          /* @__PURE__ */ jsx(TextInput, { ...inputProps }),
          /* @__PURE__ */ jsx(Field.Error, {})
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs(Field.Root, { children: [
          /* @__PURE__ */ jsx(Field.Label, { children: "Image URL" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              ...contentImageProps,
              placeholder: "Optional",
              value: contentImageProps.value.url,
              onChange: (e) => {
                contentImageProps.onChange(getImgStub(e));
              }
            }
          ),
          /* @__PURE__ */ jsx(Field.Error, {})
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs(Field.Root, { children: [
          /* @__PURE__ */ jsx(Field.Label, { children: "Content (Deprecated)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              ...CKEditorProps,
              placeholder: "Optional"
            }
          ),
          /* @__PURE__ */ jsx(Field.Error, {})
        ] }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs(
          Grid.Root,
          {
            gap: {
              large: 5,
              medium: 2,
              initial: 1
            },
            children: [
              /* @__PURE__ */ jsx(InputWrapper, { background: "neutral100", col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { children: [
                /* @__PURE__ */ jsx(Field.Label, { children: labelProps.label }),
                /* @__PURE__ */ jsx(TextInput, { ...labelProps, placeholder: "Optional" }),
                /* @__PURE__ */ jsx(Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsx(InputWrapper, { background: "neutral100", col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { children: [
                /* @__PURE__ */ jsx(Field.Label, { children: hrefProps.label }),
                /* @__PURE__ */ jsx(TextInput, { ...hrefProps, placeholder: "Optional" }),
                /* @__PURE__ */ jsx(Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsx(InputWrapper, { background: "neutral100", col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { children: [
                /* @__PURE__ */ jsx(Field.Label, { children: targetProps.label }),
                /* @__PURE__ */ jsxs(SingleSelect, { ...targetProps, children: [
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "_self", children: "_self" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "_blank", children: "_blank" })
                ] }),
                /* @__PURE__ */ jsx(Field.Error, {})
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs(
          Grid.Root,
          {
            gap: {
              large: 5,
              medium: 2,
              initial: 1
            },
            children: [
              /* @__PURE__ */ jsx(InputWrapper, { background: "neutral100", col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { children: [
                /* @__PURE__ */ jsx(Field.Label, { children: selectProps.label }),
                /* @__PURE__ */ jsxs(SingleSelect, { ...selectProps, children: [
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "top", children: "top" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "left", children: "left" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "bottom", children: "bottom" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "right", children: "right" })
                ] }),
                /* @__PURE__ */ jsx(Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsx("br", {})
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Grid.Root, { children: /* @__PURE__ */ jsx(Grid.Item, { padding: 4, background: "neutral100", col: 12, justifyContent: "end", alignItems: "end", children: /* @__PURE__ */ jsx(Flex, { style: { height: "100%" }, children: /* @__PURE__ */ jsxs(Dialog.Root, { children: [
        /* @__PURE__ */ jsx(Dialog.Trigger, { children: /* @__PURE__ */ jsx(Button, { variant: "danger", onClick: deleteMarker, children: "Delete" }) }),
        showDeleteDialog && /* @__PURE__ */ jsx(
          DialogConfirm,
          {
            type: "marker",
            index: selectedMarker,
            title: markerTitle,
            cancel: cancelDeleteMarker,
            delete: finishDeleteMarker
          }
        )
      ] }) }) }) })
    ] })
  ] }) });
};
const mutateLayouts = (layouts) => {
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
          }];
        }
        return [...acc, field];
      }, []);
    });
    return mutatedRow;
  });
};
const mutateEditViewHook = (data) => {
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
const index = {
  register(app) {
    app.addFields({
      Component: MarkersCustomFields,
      type: PLUGIN_ID
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  bootstrap(app) {
    app.registerHook(
      "Admin/CM/pages/EditView/mutate-edit-view-layout",
      mutateEditViewHook
    );
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("../_chunks/en-Byx4XI2L.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  index as default
};
