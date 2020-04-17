import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import MenuBar from "../components/MenuBar/MenuBar";
import "./Page.css";

const Page: React.FC<RouteComponentProps<{ name: string }>> = ({ match }) => {
  return (
    <IonPage>
      <MenuBar />
      <ExploreContainer />
    </IonPage>
  );
};

export default Page;
