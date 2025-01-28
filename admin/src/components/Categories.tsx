import { useState } from 'react';
import {
  Flex,
  Box,
  TextInput,
  IconButton,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Link,
} from '@strapi/design-system';
// import { MediaLibraryInput } from '@strapi/plugin-upload/admin/src/components/MediaLibraryInput/index.js'
import { Pencil, Trash, Check, Cross, ArrowUp, ArrowDown } from '@strapi/icons';
import DialogConfirm from './DialogConfirm';
import { CategoryPointer } from './styled-components';
import { Dialog } from '@strapi/design-system';

const Categories = (props) => {
  const defaultColor = '#000000';
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [addCategoryTitle, setAddCategoryTitle] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editCategoryTitle, setEditCategoryTitle] = useState(
    editIndex > -1 ? props.categories[editIndex].title : ''
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const COL_COUNT = 5;
  const ROW_COUNT = props.categories.length + 2;

  const [imagePropsState, setImagePropsState] = useState(null);

  const imageProps = {
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
      id: 'pointer',
      defaultMessage: 'image',
    },
    error: null,
    onChange: (event) => {
      changeImage(event);
    },
    required: false,
    placeholder: null,
    type: 'media',
    value: imagePropsState?.value || [],
  };

  const changeImage = (event) => {
    const imageIndex = event.target.name.split('-')[1];
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

    if (formatTitle !== '') {
      const categoriesNew = [...props.categories];

      categoriesNew.push({
        title: formatTitle,
        color: defaultColor,
        markers: [],
        pointer: {},
      });

      props.updateCategories(categoriesNew);
      setIsAddCategory(false);
      setAddCategoryTitle('');
    }
  };

  const cancelAddCategory = () => {
    setIsAddCategory(false);
    setAddCategoryTitle('');
  };

  const editCategory = (i) => {
    if (i === editIndex) {
      setEditIndex(-1);
      setEditCategoryTitle('');
    } else {
      setEditIndex(i);
      setEditCategoryTitle(props.categories[i].title);
    }
  };

  const saveEditCategory = () => {
    const formatTitle = editCategoryTitle.trim();

    if (formatTitle !== '') {
      const categoriesNew = [...props.categories];

      categoriesNew[editIndex].title = formatTitle;
      props.updateCategories(categoriesNew);
      setEditIndex(-1);
      setEditCategoryTitle('');
    }
  };

  const cancelEditCategory = () => {
    setEditIndex(-1);
    setEditCategoryTitle('');
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

  // const changeMarkerColor = (colorPicker: any, i: number) => {
  //   const categoriesNew = [...props.categories];

  //   categoriesNew[i].color = colorPicker.target.value || defaultColor;
  //   props.updateCategories(categoriesNew);
  // };

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

  return (
    <>
      <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Order</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Title</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Edit</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Pointer</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Delete</Typography>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {props.categories.map((category, i) => (
            <Tr key={i}>
              {editIndex !== i && (
                <Td>
                  <Flex>
                    <IconButton
                      variant='ghost'
                      withTooltip={false}
                      onClick={() => {
                        moveUp(i);
                      }}
                    >
                      <ArrowUp />
                    </IconButton>
                    <IconButton
                      variant='ghost'
                      withTooltip={false}
                      onClick={() => {
                        moveDown(i);
                      }}
                    >
                      <ArrowDown />
                    </IconButton>
                  </Flex>
                </Td>
              )}
              {editIndex !== i && (
                <Td>
                  <Typography textColor="neutral800">{category.title}</Typography>
                </Td>
              )}
              {editIndex !== i && (
                <Td>
                  <IconButton
                    label="Edit"
                    variant='ghost'
                    withTooltip={false}
                    onClick={() => {
                      editCategory(i);
                    }}
                  >
                    <Pencil />
                  </IconButton>
                </Td>
              )}

              {editIndex !== i && (
                <Td>
                  <CategoryPointer>
                    <>

                      <img src={category?.pointer?.value?.url} width={20} height={20} />

                      {/* {category.pointer &&
                      <MediaLibraryInput
                        key={i}
                        name={`category-${i}`}
                        {...imageProps}
                        {...category.pointer}
                      />
                    }

                    {!category.pointer &&
                      <MediaLibraryInput
                        key={i}
                        name={`category-${i}`}
                        {...imageProps}
                      />
                    } */}
                    </>
                  </CategoryPointer>
                </Td>
              )}

              {editIndex !== i && (
                <Td>

                  <Dialog.Root>
                    <Dialog.Trigger>
                      <IconButton
                        label="Delete"
                        variant='ghost'
                        withTooltip={false}
                        onClick={() => {
                          deleteCategory(i);
                        }}
                      >
                        <Trash />
                      </IconButton>
                    </Dialog.Trigger>

                    {showDeleteDialog && (
                      <DialogConfirm
                        type="category"
                        index={deleteIndex}
                        title={props.categories[deleteIndex]?.title}
                        count={props.categories[deleteIndex]?.markers?.length || 0}
                        cancel={cancelDeleteCategory}
                        delete={finishDeleteCategory}
                      />
                    )}
                  </Dialog.Root>

                </Td>
              )}
              {editIndex === i && (
                <Td colSpan={COL_COUNT - 3}>
                  <Box paddingTop={6} paddingBottom={6}>
                    <TextInput
                      value={editCategoryTitle}
                      name="categoryTitle"
                      aria-label="title of category"
                      size="S"
                      onChange={(e) => setEditCategoryTitle(e.target.value)}
                    />
                  </Box>
                </Td>
              )}
              {editIndex === i && (
                <Td>
                  <Flex>
                    <IconButton
                      label="Save"
                      variant='ghost'
                      withTooltip={false}
                      onClick={saveEditCategory}
                    >
                      <Check />
                    </IconButton>

                    <IconButton
                      label="Cancel"
                      variant='ghost'
                      withTooltip={false}
                      onClick={cancelEditCategory}
                    >
                      <Cross />
                    </IconButton>
                  </Flex>
                </Td>
              )}
            </Tr>
          ))}
          <Tr>
            <Td colSpan={COL_COUNT - 3}>
              <Flex>
                {!isAddCategory && <Link onClick={addCategory}>Add new category</Link>}
                {isAddCategory && (
                  <TextInput
                    value={addCategoryTitle}
                    name="categoryTitle"
                    aria-label="title of category"
                    size="S"
                    onChange={(e) => setAddCategoryTitle(e.target.value)}
                  />
                )}
              </Flex>
            </Td>
            <Td>
              <Box paddingTop={4} paddingBottom={4}>
                {isAddCategory && (
                  <Flex>
                    <IconButton
                      label="Save"
                      variant='ghost'
                      withTooltip={false}
                      onClick={saveAddCategory}
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      label="Cancel"
                      variant='ghost'
                      withTooltip={false}
                      onClick={cancelAddCategory}
                    >
                      <Cross />
                    </IconButton>
                  </Flex>
                )}
              </Box>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
};

export default Categories;
