import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.GsonBuildConfig;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import java.util.ArrayList;
import javax.script.*;  
import java.io.*; 

/**
 * Adding a file to a user's directory
 *
 * @author Cade Robison (Based off Gavin's code, see SignupEndpoint.java)
 */

public class FileAdder extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        boolean success = true;
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();

        // ScriptEngine ee = new ScriptEngineManager().getEngineByName("Nashorn");
        // Invocable invocable = null;  
        // String result = "";
        // // Evaluating Nashorn code  
        // try{
        //     ee.eval(new FileReader("../frontend/index.js"));
        //     invocable = (Invocable) ee;
        //     result = (String) invocable.invokeFunction("writeToJSON");
        // }
        // catch(ScriptException e){}
        // catch(NoSuchMethodException e){}
        String request = req.getReader().lines().collect(Collectors.joining());
        
        NotexUserDatabase dbase = gson.fromJson(readFile("/var/notex/users.json", Charset.defaultCharset()), NotexUserDatabase.class);
        String info = gson.fromJson(request, String.class);
        JSONParser parser = new JSONParser();
        JSONObject obj = new JSONObject();
        try{obj  = (JSONObject) parser.parse(info);}
        catch(ParseException e){};
        String username = (String) obj.get("user");
        NotexUser user = dbase.getUser(username);
        if (user == null) success = false;
        if (success) success = user.addFile(obj);
        if (success) {
            out.println("{ \"response\": \"Success\"}");
        } else {
            out.println("{ \"response\": \"Failed\"}");
        }
        // docs.add(newFile);
        // String requestData = req.getReader().lines().collect(Collectors.joining());
        // String error = "";

        // GsonBuilder builder = new GsonBuilder();
        // builder.setPrettyPrinting();
        // Gson gson = builder.create();

        // NotexLoginRequest user = gson.fromJson(requestData, NotexLoginRequest.class);

        // if (user != null && dbase.login(user)) {
        //     out.println("{ \"response\": \"Success\"}");
        // } else {
        //     out.println("{ \"response\": \"Failed\"}");
        // }


    }
        private static String readFile(String path, Charset encoding) { //Gavin's function
        try {
            byte[] encoded = Files.readAllBytes(Paths.get(path));
            return new String(encoded, encoding);
        } catch (Exception e) {
            // Do nothing
        }

        return "";
    }
}