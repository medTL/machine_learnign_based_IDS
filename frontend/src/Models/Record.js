export class Record {
  constructor(
    id,
    sourceIp,
    destinationIp,
    destinationPort,
    label,
    createdAt,
    updatedAt
  ) {
      this.id =id;
      this.sourceIp = sourceIp;
      this.destinationIp = destinationIp;
      this.destinationPort = destinationPort;
      this.label = label;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }
}
