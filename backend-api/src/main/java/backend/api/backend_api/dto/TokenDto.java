package backend.api.backend_api.dto;

public class TokenDto {

    private String tokenValue;

    // Constructor vacío (necesario para que Spring pueda deserializar el JSON)
    public TokenDto() {
    }

    public TokenDto(String tokenValue) {
        this.tokenValue = tokenValue;
    }

    // Getters y Setters
    public String getTokenValue() {
        return tokenValue;
    }

    public void setTokenValue(String tokenValue) {
        this.tokenValue = tokenValue;
    }
}