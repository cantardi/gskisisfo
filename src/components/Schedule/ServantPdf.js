import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet
} from '@react-pdf/renderer';
import { DateConvert } from '../../helpers/function';

const styles = StyleSheet.create({
  body: {
    padding: 10
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  dateBlock: {
    padding: 10,
    margin: 8,
    flex: "1 0 30%",
    width: "30%",
    borderStyle: "solid",
    borderWidth: 1, 
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  periodTitle: {
    color: "#0c5460",
    backgroundColor: "#d1ecf1",
    borderColor: "#bee5eb",
    padding: 10,
    margin: 10,
    borderStyle: "solid",     
    borderWidth: 1, 
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    textAlign: "center",
    fontFamily: "Times-Roman",
    fontSize: 24,
  },
  dateTitle: {
    fontSize: 18,
    padding: 10,
    textAlign: "center",
    fontFamily: 'Helvetica'
  },
  table: { 
    display: "table", 
    width: "auto",
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
    fontSize: 10,
    padding: 5,
    fontFamily: 'Helvetica'
  }
});

const ServantPdf = (props) => (

  <Document>

    <Page style={styles.body} size="A4" orientation="landscape">

      <Text style={styles.periodTitle}>{ props.periodName } ({ props.periodDescr })</Text>

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