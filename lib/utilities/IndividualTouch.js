export default class IndividualTouch {
  constructor(pageX, pageY, responderID) {
    this.responderID = responderID;
    this.X0 = pageX;
    this.Y0 = pageY;
    this.pageX = pageX;
    this.pageY = pageY;
    this.dx = 0;
    this.dy = 0;

    this.update = this.update.bind(this);
  };

  update(newPageX, newPageY) {
    this.dx = newPageX - this.X0;
    this.dy = newPageY - this.Y0;
    this.pageX = newPageX;
    this.pageY = newPageY;
  }
}
