import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function BootstrapModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      fullscreen
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          RealAssist Report
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe width={"100%"} height={"100%"} src={props.src} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BootstrapModal;