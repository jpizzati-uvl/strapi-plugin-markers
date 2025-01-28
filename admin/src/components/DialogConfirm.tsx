import { Typography, Dialog, Button } from '@strapi/design-system';
import { Trash, WarningCircle } from '@strapi/icons';

const DialogConfirm = (props) => {
  const markerConfirmation = <span>Are you sure you want to delete "{props.title}" marker?</span>;
  const categoryConfirmation1 = <span>Are you sure you want to delete "{props.title}" category?<br /><br /></span>;
  let categoryConfirmation2;
  switch (props.count) {
    case 0:
      categoryConfirmation2 = <span>This category doesn't have any marker.</span>;
      break;
    case 1:
      categoryConfirmation2 = <span>This category has 1 marker on the map.<br />It will be deleted.</span>;
      break;
    default:
      categoryConfirmation2 = <span>This category has {props.count} markers on the map.<br />They all will be deleted.</span>;
  }
  const categoryConfirmation = <span>{categoryConfirmation1} {categoryConfirmation2}</span>;

  const confirmationLabel = props.type === "marker" ? markerConfirmation : categoryConfirmation

  return (
    <Dialog.Content onClose={() => props.cancel()} title="Confirmation" isOpen={props.index > -1 ? true : false}>
      <Dialog.Header>Confirmation</Dialog.Header>
      <Dialog.Body>
        <WarningCircle fill="danger600" width={25} height={25} />
        <Typography textAlign="center">
          {props.type === "marker" ? markerConfirmation : categoryConfirmation}
        </Typography>
      </Dialog.Body>

      <Dialog.Footer>
        <Dialog.Cancel>
          <Button onClick={() => props.cancel()} variant="tertiary">
            Cancel
          </Button>
        </Dialog.Cancel>
        <Dialog.Action>
          <Button onClick={() => props.delete(props.index)} variant="danger-light" startIcon={<Trash />}>
            Yes, Delete
          </Button>
        </Dialog.Action>
      </Dialog.Footer>
    </Dialog.Content>
  );
};

export default DialogConfirm;
