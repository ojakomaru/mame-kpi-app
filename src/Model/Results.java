package Model;

import java.io.Serializable;

import org.apache.commons.lang3.builder.EqualsBuilder;

public class Results implements Serializable {
  private int id;
  private int kpiID;
  private String date;
  private int result;

  public Results() {};
  public Results(int kpiID, String date, int result) {
    this.kpiID = kpiID;
    this.date = date;
    this.result = result;
  }
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o);
  }
  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }
  public int getKpiID() {
    return kpiID;
  }
  public void setKpiID(int kpiID) {
    this.kpiID = kpiID;
  }
  public String getDate() {
    return date;
  }
  public void setDate(String date) {
    this.date = date;
  }
  public int getResult() {
    return result;
  }
  public void setResult(int result) {
    this.result = result;
  }
}
