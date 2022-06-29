import * as React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import {Root} from "./pages/Root";
import {LinkdropPage} from "./pages/LinkdropPage";
import {ClaimPage} from "./pages/ClaimPage";
import {Home} from "./pages/Home";
import {AccountPage} from "./pages/AccountPage";
import {Interceptor} from "./components/Interceptor";


export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="" element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="linkdrop" element={<LinkdropPage />} />
          <Route path="claim/:base64Params" element={<ClaimPage />} />
          <Route path="account" element={<Interceptor redirect={'/linkdrop'} children={<AccountPage/>}/>} />
        </Route>
      </Routes>
    </Router>
  </ChakraProvider>
)
