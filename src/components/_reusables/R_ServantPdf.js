import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { DateConvert } from '../../helpers/function';

const styles = StyleSheet.create({

  titleWrapper: {
    backgroundColor: "#004EA6",
    padding: 10
  },

  periodTitle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 3,
  },

  wrapper: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "left",
    alignItems: "flex-start"
  },

  dateTitle: {
    fontSize: 10,
    color: "#985600",
    marginBottom: 5,
    textAlign: "left",
    fontFamily: "Helvetica-Bold"
  },

  dateBlock: {
    marginBottom: 20,
    marginLeft: 20,
    flex: "1 0 auto",
    width: "45%"
  },

  table: { 
    display: "table", 
    width: "auto",
    padding: 5
  }, 

  tableRow: { 
    margin: "auto", 
    flexDirection: "row",
  },

  tableCol: {
    width: "50%", 
    borderStyle: "solid", 
    borderColor: '#bfbfbf',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderRightWidth: 0, 
    borderBottomWidth: 0
  },

  tableCell: { 
    textAlign: "left",
    fontSize: 9,
    padding: 5,
    fontFamily: 'Helvetica'
  }
});

const ServantPdf = (props) => (

  <Document>

    <Page size="A4" orientation="portrait">
          
      <View style={styles.titleWrapper}>
        <Text style={styles.periodTitle} fixed>{"Praise and Worship"}</Text>
        <Text style={styles.periodTitle} fixed>{props.periodDescr}</Text>
      </View>   
      
      <View style={styles.wrapper}>
        {
          props.periodDates.map(date => {
            return(
              <View key={date.id} style={styles.dateBlock}>
                <Text style={styles.dateTitle}>
                  { DateConvert(new Date(date.predefineddate)) }
                </Text>

                <View style={styles.table}>
                  {
                    props.churchRoles.length > 0 &&
                    props.churchRoles.map(role => {
                      return(
                        <View key={`tr-${date.id}-${role.id}`} style={styles.tableRow}>
                          <View style={styles.tableCol}> 
                            <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold' }]}>  
                              {role.description}
                            </Text>
                          </View>
                          <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>  
                            {
                              props.returnServantName(date.id, role.id)
                            }
                            </Text>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
            )
          })
        }
      </View>
    </Page>
  </Document>
);

export default ServantPdf;