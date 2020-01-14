import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

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

  detailWrapper: {
    paddingTop: 15,
    display: "flex",
    flexDirection: "column",
    flexFlow: "row",
    maxHeight: "750px",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },

  songBlock: {
    marginBottom: 10,
    marginLeft: 10,
    flex: "1 0 auto",
    width: "45%",
    borderStyle: "solid",     
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderRightWidth: 0,
    borderBottomWidth: 0
  },

  songTitle: {
    fontSize: 11,
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 3,
    textAlign: "left",
    fontFamily: 'Helvetica-Bold',
  },

  songWriter: {
    fontSize: 8,
    paddingLeft: 5,
    color: "#985600",
    marginBottom: 5,
    textAlign: "left",
    fontFamily: 'Helvetica-Oblique',
  },

  songLyrics: {
    fontSize: 10,
    padding: 5,
    textAlign: "left",
    fontFamily: 'Helvetica'
  },

});

const ServiceSongPdf = (props) => (

  <Document>

    <Page size="A4" orientation="portrait">
      
      <View style={styles.titleWrapper}>
        <Text style={styles.periodTitle} fixed>{"Praise and Worship"}</Text>
        <Text style={styles.periodTitle} fixed>{props.periodName}</Text>
        <Text style={styles.periodTitle} fixed>{props.serviceDate}</Text>
      </View>   

      <View style={styles.detailWrapper}>
        {
          props.selectedSongs.length > 0 &&
          props.selectedSongs
          .map(song => {
            return (
              <View key={song.id} style={styles.songBlock}>
                <Text style={styles.songTitle}>{`${song.songname} (Do=${song.songkeydescr})`}</Text>
                <Text style={styles.songWriter}>{song.composer}</Text>
                <Text style={styles.songLyrics}>{song.lyric}</Text>
              </View>
            )
          })
        }
      </View>
    
    </Page>
  </Document>
);

export default ServiceSongPdf;